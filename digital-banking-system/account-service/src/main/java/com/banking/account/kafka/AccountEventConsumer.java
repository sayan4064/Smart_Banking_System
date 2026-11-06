package com.banking.account.kafka;

import com.banking.account.service.AccountService;
import com.banking.common.constant.KafkaTopics;
import com.banking.common.event.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccountEventConsumer {

    private final AccountService accountService;
    private final AccountEventProducer eventProducer;

    /**
     * Saga Step 3: Handle Transaction Initiated
     * Attempt atomic debit on sender's account.
     */
    @KafkaListener(topics = KafkaTopics.TRANSACTION_INITIATED, groupId = "account-service-group")
    public void handleTransactionInitiated(TransactionInitiatedEvent event) {
        log.info("Received TransactionInitiatedEvent for reference: {}", event.getTransactionReference());

        String idempotencyKey = event.getTransactionReference() + "_DEBIT";
        try {
            accountService.debitAccount(
                    event.getSenderAccountNumber(),
                    event.getAmount(),
                    event.getTransactionReference(),
                    idempotencyKey,
                    event.getDescription()
            );

            log.info("Sender account debited successfully for txn: {}", event.getTransactionReference());
            // Balance successfully debited; Fraud Detection Service concurrently/sequentially evaluates risk.

        } catch (Exception ex) {
            log.error("Debit failed for txn: {}. Reason: {}. Emitting TransactionFailedEvent",
                    event.getTransactionReference(), ex.getMessage());

            TransactionFailedEvent failedEvent = TransactionFailedEvent.builder()
                    .eventId("EVT-" + System.currentTimeMillis())
                    .transactionReference(event.getTransactionReference())
                    .senderAccountNumber(event.getSenderAccountNumber())
                    .receiverAccountNumber(event.getReceiverAccountNumber())
                    .amount(event.getAmount())
                    .failureReason(ex.getMessage())
                    .timestamp(Instant.now())
                    .build();

            eventProducer.publishEvent(KafkaTopics.TRANSACTION_FAILED, event.getTransactionReference(), failedEvent);
        }
    }

    /**
     * Saga Settlement: Credit Receiver Account once Transaction is marked COMPLETED
     */
    @KafkaListener(topics = KafkaTopics.TRANSACTION_COMPLETED, groupId = "account-service-group")
    public void handleTransactionCompleted(TransactionCompletedEvent event) {
        log.info("Received TransactionCompletedEvent for txn: {}. Crediting receiver account: {}",
                event.getTransactionReference(), event.getReceiverAccountNumber());

        String idempotencyKey = event.getTransactionReference() + "_CREDIT";
        try {
            accountService.creditAccount(
                    event.getReceiverAccountNumber(),
                    event.getAmount(),
                    event.getTransactionReference(),
                    idempotencyKey,
                    "Credit from transfer: " + event.getTransactionReference()
            );
            log.info("Receiver account credited successfully for txn: {}", event.getTransactionReference());
        } catch (Exception ex) {
            log.error("Error crediting receiver account for completed txn {}: {}",
                    event.getTransactionReference(), ex.getMessage(), ex);
        }
    }

    /**
     * Saga Compensation: Refund Sender Account if fraud rejected or downstream failure occurred
     */
    @KafkaListener(topics = KafkaTopics.TRANSACTION_COMPENSATION_REQUESTED, groupId = "account-service-group")
    public void handleCompensationRequested(TransactionCompensationRequestedEvent event) {
        log.warn("Received TransactionCompensationRequestedEvent for txn: {}. Triggering refund for sender account.",
                event.getTransactionReference());

        String idempotencyKey = event.getTransactionReference() + "_REFUND";
        try {
            accountService.refundAccount(
                    event.getSenderAccountNumber(),
                    event.getAmount(),
                    event.getTransactionReference(),
                    idempotencyKey,
                    event.getReason()
            );

            log.info("Compensating refund executed for txn: {}. Publishing TransactionRefundedEvent.",
                    event.getTransactionReference());

            TransactionRefundedEvent refundedEvent = TransactionRefundedEvent.builder()
                    .eventId("EVT-" + System.currentTimeMillis())
                    .transactionReference(event.getTransactionReference())
                    .senderAccountNumber(event.getSenderAccountNumber())
                    .amount(event.getAmount())
                    .currency(event.getCurrency())
                    .refundedAt(Instant.now())
                    .timestamp(Instant.now())
                    .build();

            eventProducer.publishEvent(KafkaTopics.TRANSACTION_REFUNDED, event.getTransactionReference(), refundedEvent);

        } catch (Exception ex) {
            log.error("Compensation failed for txn {}: {}", event.getTransactionReference(), ex.getMessage(), ex);
        }
    }
}
