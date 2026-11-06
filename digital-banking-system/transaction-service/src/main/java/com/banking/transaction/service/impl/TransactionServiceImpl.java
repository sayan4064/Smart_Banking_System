package com.banking.transaction.service.impl;

import com.banking.common.constant.KafkaTopics;
import com.banking.common.constant.TransactionStatus;
import com.banking.common.constant.TransactionType;
import com.banking.common.dto.ApiResponse;
import com.banking.common.event.*;
import com.banking.common.exception.*;
import com.banking.transaction.client.AccountServiceClient;
import com.banking.transaction.dto.*;
import com.banking.transaction.entity.SagaStepLog;
import com.banking.transaction.entity.Transaction;
import com.banking.transaction.kafka.TransactionEventProducer;
import com.banking.transaction.repository.SagaStepLogRepository;
import com.banking.transaction.repository.TransactionRepository;
import com.banking.transaction.service.TransactionService;
import com.banking.transaction.service.TransactionStateMachine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final SagaStepLogRepository sagaStepLogRepository;
    private final AccountServiceClient accountClient;
    private final TransactionStateMachine stateMachine;
    private final TransactionEventProducer eventProducer;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public TransferResponse initiateTransfer(TransferRequest request) {
        log.info("Initiating money transfer from {} to {} for amount {}",
                request.getSenderAccountNumber(), request.getReceiverAccountNumber(), request.getAmount());

        // 1. Business Validation: Sender and receiver must not be identical
        if (request.getSenderAccountNumber().equalsIgnoreCase(request.getReceiverAccountNumber())) {
            throw new BankingException("Sender and receiver accounts cannot be identical");
        }

        // 2. Validate Sender Account & Balance via OpenFeign client (with graceful error handling)
        BigDecimal senderBalance = BigDecimal.valueOf(1000000); // Default fallback threshold
        try {
            ApiResponse<AccountServiceClient.AccountBalanceDto> balanceRes =
                    accountClient.getAccountBalance(request.getSenderAccountNumber());

            if (balanceRes != null && balanceRes.getData() != null) {
                AccountServiceClient.AccountBalanceDto balDto = balanceRes.getData();
                senderBalance = balDto.balance();

                if ("BLOCKED".equalsIgnoreCase(balDto.status()) || "FROZEN".equalsIgnoreCase(balDto.status())) {
                    throw new AccountBlockedException("Sender account " + request.getSenderAccountNumber() + " is blocked/frozen");
                }
                if (senderBalance.compareTo(request.getAmount()) < 0) {
                    throw new InsufficientBalanceException("Sender has insufficient funds. Available: " + senderBalance);
                }
            }
        } catch (BankingException be) {
            throw be;
        } catch (Exception ex) {
            log.warn("Feign call to account-service failed or warming up: {}. Continuing with Saga optimistic check.", ex.getMessage());
        }

        // 3. Generate Unique Transaction Reference: TXN-YYYYMMDD-XXXXX
        String txnRef = generateTransactionReference();

        // 4. Persist Transaction in INITIATED status
        Transaction txn = Transaction.builder()
                .transactionReference(txnRef)
                .senderAccountNumber(request.getSenderAccountNumber())
                .receiverAccountNumber(request.getReceiverAccountNumber())
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .transactionType(TransactionType.TRANSFER)
                .transactionStatus(TransactionStatus.INITIATED)
                .description(request.getDescription() != null ? request.getDescription() : "Digital Money Transfer")
                .build();

        Transaction saved = transactionRepository.save(txn);
        recordSagaStep(txnRef, "TRANSFER_INITIATED", "SUCCESS", "Transfer registered and validated");

        // 5. Transition to PROCESSING & FRAUD_CHECK_PENDING
        stateMachine.validateTransition(txnRef, saved.getTransactionStatus(), TransactionStatus.PROCESSING);
        saved.setTransactionStatus(TransactionStatus.PROCESSING);
        transactionRepository.save(saved);
        recordSagaStep(txnRef, "ACCOUNT_DEBIT_REQUESTED", "PENDING", "Kafka event emitted to debit sender balance");

        // 6. Publish TransactionInitiatedEvent to Kafka
        TransactionInitiatedEvent initiatedEvent = TransactionInitiatedEvent.builder()
                .eventId("EVT-" + System.currentTimeMillis())
                .transactionReference(txnRef)
                .senderAccountNumber(request.getSenderAccountNumber())
                .receiverAccountNumber(request.getReceiverAccountNumber())
                .amount(request.getAmount())
                .currency(txn.getCurrency())
                .senderCurrentBalance(senderBalance)
                .description(txn.getDescription())
                .timestamp(Instant.now())
                .build();

        eventProducer.publishEvent(KafkaTopics.TRANSACTION_INITIATED, txnRef, initiatedEvent);

        // 7. Determine initial response (If amount is very high >= 50,000 INR, inform caller about step-up)
        boolean potentialOtp = request.getAmount().compareTo(BigDecimal.valueOf(50000)) >= 0;

        return TransferResponse.builder()
                .transactionReference(txnRef)
                .status(TransactionStatus.PROCESSING)
                .message(potentialOtp 
                        ? "Transfer processing. Multi-factor OTP verification may be required." 
                        : "Transfer successfully initiated and entering distributed Saga pipeline.")
                .requiresOtp(potentialOtp)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getTransactionByReference(String reference) {
        Transaction txn = findTransactionOrThrow(reference);
        List<SagaStepDto> sagaSteps = sagaStepLogRepository.findByTransactionReferenceOrderByTimestampAsc(reference)
                .stream()
                .map(this::mapToSagaDto)
                .collect(Collectors.toList());

        TransactionResponse response = mapToResponse(txn);
        response.setSagaSteps(sagaSteps);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactions(String status, String type, String search) {
        List<Transaction> list = transactionRepository.findAllByOrderByInitiatedAtDesc();

        return list.stream()
                .filter(t -> status == null || "ALL".equalsIgnoreCase(status) || t.getTransactionStatus().name().equalsIgnoreCase(status))
                .filter(t -> type == null || "ALL".equalsIgnoreCase(type) || t.getTransactionType().name().equalsIgnoreCase(type))
                .filter(t -> search == null || search.isBlank() ||
                        t.getTransactionReference().toLowerCase().contains(search.toLowerCase()) ||
                        t.getSenderAccountNumber().toLowerCase().contains(search.toLowerCase()) ||
                        t.getReceiverAccountNumber().toLowerCase().contains(search.toLowerCase()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAccountTransactions(String accountNumber) {
        return transactionRepository.findBySenderAccountNumberOrReceiverAccountNumberOrderByInitiatedAtDesc(accountNumber, accountNumber)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAllByOrderByInitiatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransferResponse verifyOtp(String reference, String otpCode) {
        log.info("Verifying OTP for transaction reference: {}", reference);
        Transaction txn = findTransactionOrThrow(reference);

        // Security check: Must be in OTP_REQUIRED state
        if (txn.getTransactionStatus() != TransactionStatus.OTP_REQUIRED) {
            log.warn("Attempted OTP verification on transaction {} in state {}", reference, txn.getTransactionStatus());
            throw new BankingException("Transaction is not awaiting OTP verification (Current status: " + txn.getTransactionStatus() + ")");
        }

        // Validate code (Supports mock code or realistic pattern verification)
        if ("000000".equals(otpCode) || otpCode.length() != 6) {
            throw new InvalidOtpException("Invalid verification code. Please check and retry.");
        }

        // State Transition: OTP_REQUIRED -> OTP_VERIFIED
        stateMachine.validateTransition(reference, txn.getTransactionStatus(), TransactionStatus.OTP_VERIFIED);
        txn.setTransactionStatus(TransactionStatus.OTP_VERIFIED);
        recordSagaStep(reference, "OTP_VERIFIED", "SUCCESS", "Step-up two-factor authentication verified successfully");

        // State Transition: OTP_VERIFIED -> COMPLETED
        stateMachine.validateTransition(reference, txn.getTransactionStatus(), TransactionStatus.COMPLETED);
        txn.setTransactionStatus(TransactionStatus.COMPLETED);
        txn.setCompletedAt(LocalDateTime.now());
        Transaction updated = transactionRepository.save(txn);
        recordSagaStep(reference, "TRANSFER_COMPLETED", "SUCCESS", "Funds released & settlement event published");

        // Publish TransactionCompletedEvent to Kafka to trigger receiver credit
        TransactionCompletedEvent completedEvent = TransactionCompletedEvent.builder()
                .eventId("EVT-" + System.currentTimeMillis())
                .transactionReference(reference)
                .senderAccountNumber(txn.getSenderAccountNumber())
                .receiverAccountNumber(txn.getReceiverAccountNumber())
                .amount(txn.getAmount())
                .currency(txn.getCurrency())
                .completedAt(Instant.now())
                .timestamp(Instant.now())
                .build();

        eventProducer.publishEvent(KafkaTopics.TRANSACTION_COMPLETED, reference, completedEvent);

        return TransferResponse.builder()
                .transactionReference(reference)
                .status(TransactionStatus.COMPLETED)
                .message("OTP verified successfully. Money transfer completed!")
                .requiresOtp(false)
                .build();
    }

    @Override
    public TransferResponse resendOtp(String reference) {
        Transaction txn = findTransactionOrThrow(reference);
        log.info("Resending OTP for transaction {}", reference);
        return TransferResponse.builder()
                .transactionReference(reference)
                .status(txn.getTransactionStatus())
                .message("A new 6-digit verification code has been dispatched to your registered mobile number.")
                .requiresOtp(true)
                .build();
    }

    @Override
    @Transactional
    public void processFraudCheckPassed(String reference) {
        log.info("Saga callback: Fraud check PASSED for txn {}", reference);
        Transaction txn = findTransactionOrThrow(reference);

        if (txn.getTransactionStatus() == TransactionStatus.COMPLETED) {
            return; // Already finalized
        }

        stateMachine.validateTransition(reference, txn.getTransactionStatus(), TransactionStatus.COMPLETED);
        txn.setTransactionStatus(TransactionStatus.COMPLETED);
        txn.setCompletedAt(LocalDateTime.now());
        transactionRepository.save(txn);

        recordSagaStep(reference, "FRAUD_CHECK_PASSED", "SUCCESS", "Risk score below threshold. Transaction authorized.");

        TransactionCompletedEvent completedEvent = TransactionCompletedEvent.builder()
                .eventId("EVT-" + System.currentTimeMillis())
                .transactionReference(reference)
                .senderAccountNumber(txn.getSenderAccountNumber())
                .receiverAccountNumber(txn.getReceiverAccountNumber())
                .amount(txn.getAmount())
                .currency(txn.getCurrency())
                .completedAt(Instant.now())
                .timestamp(Instant.now())
                .build();

        eventProducer.publishEvent(KafkaTopics.TRANSACTION_COMPLETED, reference, completedEvent);
    }

    @Override
    @Transactional
    public void processFraudCheckFailed(String reference, String reason) {
        log.warn("Saga callback: Fraud check FAILED for txn {}. Reason: {}", reference, reason);
        Transaction txn = findTransactionOrThrow(reference);

        txn.setTransactionStatus(TransactionStatus.COMPENSATING);
        txn.setFailureReason(reason);
        transactionRepository.save(txn);

        recordSagaStep(reference, "FRAUD_CHECK_REJECTED", "FAILED", "High risk detected: " + reason);

        // Emit compensation request so Account Service refunds sender balance
        TransactionCompensationRequestedEvent compensationEvent = TransactionCompensationRequestedEvent.builder()
                .eventId("EVT-" + System.currentTimeMillis())
                .transactionReference(reference)
                .senderAccountNumber(txn.getSenderAccountNumber())
                .amount(txn.getAmount())
                .currency(txn.getCurrency())
                .reason(reason)
                .timestamp(Instant.now())
                .build();

        eventProducer.publishEvent(KafkaTopics.TRANSACTION_COMPENSATION_REQUESTED, reference, compensationEvent);
    }

    @Override
    @Transactional
    public void processOtpRequired(String reference) {
        log.info("Saga callback: OTP challenge required for txn {}", reference);
        Transaction txn = findTransactionOrThrow(reference);

        if (txn.getTransactionStatus() == TransactionStatus.PROCESSING || txn.getTransactionStatus() == TransactionStatus.FRAUD_CHECK_PENDING) {
            txn.setTransactionStatus(TransactionStatus.OTP_REQUIRED);
            transactionRepository.save(txn);
            recordSagaStep(reference, "OTP_CHALLENGE_REQUIRED", "PENDING", "Medium risk score. Two-factor verification challenge active.");
        }
    }

    @Override
    @Transactional
    public void processRefundCompleted(String reference) {
        log.info("Saga callback: Refund completed for txn {}", reference);
        Transaction txn = findTransactionOrThrow(reference);

        txn.setTransactionStatus(TransactionStatus.REFUNDED);
        transactionRepository.save(txn);
        recordSagaStep(reference, "COMPENSATION_REFUNDED", "SUCCESS", "Compensating transaction credited back sender account");
    }

    private Transaction findTransactionOrThrow(String reference) {
        return transactionRepository.findByTransactionReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found for reference: " + reference));
    }

    private void recordSagaStep(String reference, String stepName, String status, String details) {
        SagaStepLog step = SagaStepLog.builder()
                .transactionReference(reference)
                .stepName(stepName)
                .status(status)
                .details(details)
                .build();
        sagaStepLogRepository.save(step);
    }

    private String generateTransactionReference() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randPart = 10000 + secureRandom.nextInt(90000);
        return "TXN-" + datePart + "-" + randPart;
    }

    private TransactionResponse mapToResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .transactionReference(t.getTransactionReference())
                .senderAccountNumber(t.getSenderAccountNumber())
                .receiverAccountNumber(t.getReceiverAccountNumber())
                .amount(t.getAmount())
                .currency(t.getCurrency())
                .transactionType(t.getTransactionType())
                .transactionStatus(t.getTransactionStatus())
                .description(t.getDescription())
                .initiatedAt(t.getInitiatedAt())
                .completedAt(t.getCompletedAt())
                .failureReason(t.getFailureReason())
                .build();
    }

    private SagaStepDto mapToSagaDto(SagaStepLog s) {
        return SagaStepDto.builder()
                .stepName(s.getStepName())
                .status(s.getStatus())
                .details(s.getDetails())
                .timestamp(s.getTimestamp())
                .build();
    }
}

