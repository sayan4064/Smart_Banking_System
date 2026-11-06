package com.banking.account.service;

import com.banking.account.dto.*;
import com.banking.common.constant.AccountStatus;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {

    AccountResponse createAccount(CreateAccountRequest request);

    AccountResponse getAccountByNumber(String accountNumber);

    List<AccountResponse> getAccountsByCustomerId(String customerId);

    List<AccountResponse> getAllAccounts();

    BalanceResponse getAccountBalance(String accountNumber);

    AccountResponse updateAccountStatus(String accountNumber, AccountStatus newStatus, String reason);

    AccountResponse debitAccount(String accountNumber, BigDecimal amount, String txnRef, String idempotencyKey, String description);

    AccountResponse creditAccount(String accountNumber, BigDecimal amount, String txnRef, String idempotencyKey, String description);

    AccountResponse refundAccount(String accountNumber, BigDecimal amount, String txnRef, String idempotencyKey, String reason);

    List<LedgerEntryResponse> getAccountLedger(String accountNumber);
}

