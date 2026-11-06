package com.banking.account.service.impl;

import com.banking.account.dto.*;
import com.banking.account.entity.Account;
import com.banking.account.entity.AccountLedger;
import com.banking.account.entity.IdempotencyRecord;
import com.banking.account.repository.AccountLedgerRepository;
import com.banking.account.repository.AccountRepository;
import com.banking.account.repository.IdempotencyRecordRepository;
import com.banking.account.service.AccountService;
import com.banking.common.constant.AccountStatus;
import com.banking.common.exception.AccountBlockedException;
import com.banking.common.exception.InsufficientBalanceException;
import com.banking.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AccountLedgerRepository ledgerRepository;
    private final IdempotencyRecordRepository idempotencyRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        log.info("Creating new bank account for customer: {}", request.getCustomerId());

        String accountNumber = generateUniqueAccountNumber();

        BigDecimal initialDeposit = request.getInitialDeposit() != null 
                ? request.getInitialDeposit() 
                : BigDecimal.ZERO;

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .customerId(request.getCustomerId())
                .accountHolderName(request.getAccountHolderName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .accountType(request.getAccountType())
                .balance(initialDeposit)
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        Account saved = accountRepository.save(account);

        if (initialDeposit.compareTo(BigDecimal.ZERO) > 0) {
            AccountLedger initialEntry = AccountLedger.builder()
                    .accountNumber(accountNumber)
                    .transactionReference("INIT-" + System.currentTimeMillis())
                    .operationType("CREDIT")
                    .amount(initialDeposit)
                    .balanceBefore(BigDecimal.ZERO)
                    .balanceAfter(initialDeposit)
                    .description("Initial Opening Account Deposit")
                    .build();
            ledgerRepository.save(initialEntry);
        }

        log.info("Successfully created account: {} for {}", saved.getAccountNumber(), saved.getAccountHolderName());
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountByNumber(String accountNumber) {
        Account account = findAccountOrThrow(accountNumber);
        return mapToResponse(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAccountsByCustomerId(String customerId) {
        return accountRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BalanceResponse getAccountBalance(String accountNumber) {
        Account account = findAccountOrThrow(accountNumber);
        return BalanceResponse.builder()
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .status(account.getAccountStatus())
                .build();
    }

    @Override
    @Transactional
    public AccountResponse updateAccountStatus(String accountNumber, AccountStatus newStatus, String reason) {
        log.info("Updating account status for {}: new status = {}, reason = {}", accountNumber, newStatus, reason);
        Account account = findAccountOrThrow(accountNumber);
        account.setAccountStatus(newStatus);
        Account updated = accountRepository.save(account);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public AccountResponse debitAccount(String accountNumber, BigDecimal amount, String txnRef, String idempotencyKey, String description) {
        log.info("Processing debit request for account: {}, amount: {}, ref: {}, idempotency: {}",
                accountNumber, amount, txnRef, idempotencyKey);

        // 1. Idempotency Protection Check
        if (idempotencyKey != null && idempotencyRepository.existsByIdempotencyKey(idempotencyKey)) {
            log.warn("Duplicate debit request detected with idempotency key: {}. Returning current state.", idempotencyKey);
            return mapToResponse(findAccountOrThrow(accountNumber));
        }

        // 2. Fetch Account
        Account account = findAccountOrThrow(accountNumber);

        // 3. Status Verification
        if (account.getAccountStatus() == AccountStatus.BLOCKED || account.getAccountStatus() == AccountStatus.FROZEN) {
            log.error("Debit failed. Account {} is {}", accountNumber, account.getAccountStatus());
            throw new AccountBlockedException("Account " + accountNumber + " is blocked and cannot perform outgoing debits");
        }

        // 4. Balance Verification
        if (account.getBalance().compareTo(amount) < 0) {
            log.error("Debit failed. Insufficient balance on account {}. Available: {}, Requested: {}",
                    accountNumber, account.getBalance(), amount);
            throw new InsufficientBalanceException("Insufficient balance in account " + accountNumber + ". Available: " + account.getBalance());
        }

        // 5. Execute Atomic Balance Deduction
        BigDecimal balanceBefore = account.getBalance();
        BigDecimal balanceAfter = balanceBefore.subtract(amount);
        account.setBalance(balanceAfter);

        Account saved = accountRepository.save(account);

        // 6. Record Audit Ledger
        AccountLedger ledger = AccountLedger.builder()
                .accountNumber(accountNumber)
                .transactionReference(txnRef)
                .operationType("DEBIT")
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .description(description != null ? description : "Account Debit")
                .build();
        ledgerRepository.save(ledger);

        // 7. Save Idempotency Record
        if (idempotencyKey != null) {
            IdempotencyRecord record = IdempotencyRecord.builder()
                    .idempotencyKey(idempotencyKey)
                    .accountNumber(accountNumber)
                    .operationType("DEBIT")
                    .amount(amount)
                    .status("SUCCESS")
                    .build();
            idempotencyRepository.save(record);
        }

        log.info("Debit successful for {}. New balance: {}", accountNumber, balanceAfter);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public AccountResponse creditAccount(String accountNumber, BigDecimal amount, String txnRef, String idempotencyKey, String description) {
        log.info("Processing credit request for account: {}, amount: {}, ref: {}, idempotency: {}",
                accountNumber, amount, txnRef, idempotencyKey);

        // 1. Idempotency Protection Check
        if (idempotencyKey != null && idempotencyRepository.existsByIdempotencyKey(idempotencyKey)) {
            log.warn("Duplicate credit request detected with idempotency key: {}. Returning current state.", idempotencyKey);
            return mapToResponse(findAccountOrThrow(accountNumber));
        }

        // 2. Fetch Account
        Account account = findAccountOrThrow(accountNumber);

        // 3. Status Verification
        if (account.getAccountStatus() == AccountStatus.BLOCKED || account.getAccountStatus() == AccountStatus.CLOSED) {
            log.error("Credit failed. Account {} is {}", accountNumber, account.getAccountStatus());
            throw new AccountBlockedException("Account " + accountNumber + " is not eligible to receive funds (Status: " + account.getAccountStatus() + ")");
        }

        // 4. Execute Atomic Balance Addition
        BigDecimal balanceBefore = account.getBalance();
        BigDecimal balanceAfter = balanceBefore.add(amount);
        account.setBalance(balanceAfter);

        Account saved = accountRepository.save(account);

        // 5. Record Audit Ledger
        AccountLedger ledger = AccountLedger.builder()
                .accountNumber(accountNumber)
                .transactionReference(txnRef)
                .operationType("CREDIT")
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .description(description != null ? description : "Account Credit")
                .build();
        ledgerRepository.save(ledger);

        // 6. Save Idempotency Record
        if (idempotencyKey != null) {
            IdempotencyRecord record = IdempotencyRecord.builder()
                    .idempotencyKey(idempotencyKey)
                    .accountNumber(accountNumber)
                    .operationType("CREDIT")
                    .amount(amount)
                    .status("SUCCESS")
                    .build();
            idempotencyRepository.save(record);
        }

        log.info("Credit successful for {}. New balance: {}", accountNumber, balanceAfter);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public AccountResponse refundAccount(String accountNumber, BigDecimal amount, String txnRef, String idempotencyKey, String reason) {
        log.info("Processing Saga compensating refund for account: {}, amount: {}, ref: {}, reason: {}",
                accountNumber, amount, txnRef, reason);

        Account account = findAccountOrThrow(accountNumber);
        BigDecimal balanceBefore = account.getBalance();
        BigDecimal balanceAfter = balanceBefore.add(amount);
        account.setBalance(balanceAfter);

        Account saved = accountRepository.save(account);

        AccountLedger ledger = AccountLedger.builder()
                .accountNumber(accountNumber)
                .transactionReference(txnRef)
                .operationType("REFUND")
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .description("Saga Compensation: " + (reason != null ? reason : "Transaction Failed Refund"))
                .build();
        ledgerRepository.save(ledger);

        if (idempotencyKey != null && !idempotencyRepository.existsByIdempotencyKey(idempotencyKey)) {
            IdempotencyRecord record = IdempotencyRecord.builder()
                    .idempotencyKey(idempotencyKey)
                    .accountNumber(accountNumber)
                    .operationType("REFUND")
                    .amount(amount)
                    .status("SUCCESS")
                    .build();
            idempotencyRepository.save(record);
        }

        log.info("Compensating refund completed for {}. Restored balance: {}", accountNumber, balanceAfter);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LedgerEntryResponse> getAccountLedger(String accountNumber) {
        findAccountOrThrow(accountNumber); // Verify existence
        return ledgerRepository.findByAccountNumberOrderByCreatedAtDesc(accountNumber)
                .stream()
                .map(this::mapToLedgerResponse)
                .collect(Collectors.toList());
    }

    private Account findAccountOrThrow(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account with number " + accountNumber + " not found"));
    }

    private String generateUniqueAccountNumber() {
        String accNum;
        do {
            int randomPart = 10000000 + secureRandom.nextInt(90000000);
            accNum = "ACC-" + randomPart;
        } while (accountRepository.existsByAccountNumber(accNum));
        return accNum;
    }

    private AccountResponse mapToResponse(Account a) {
        return AccountResponse.builder()
                .id(a.getId())
                .accountNumber(a.getAccountNumber())
                .customerId(a.getCustomerId())
                .accountHolderName(a.getAccountHolderName())
                .email(a.getEmail())
                .phoneNumber(a.getPhoneNumber())
                .accountType(a.getAccountType())
                .balance(a.getBalance())
                .currency(a.getCurrency())
                .accountStatus(a.getAccountStatus())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }

    private LedgerEntryResponse mapToLedgerResponse(AccountLedger l) {
        return LedgerEntryResponse.builder()
                .id(l.getId())
                .accountNumber(l.getAccountNumber())
                .transactionReference(l.getTransactionReference())
                .operationType(l.getOperationType())
                .amount(l.getAmount())
                .balanceBefore(l.getBalanceBefore())
                .balanceAfter(l.getBalanceAfter())
                .description(l.getDescription())
                .createdAt(l.getCreatedAt())
                .build();
    }
}
