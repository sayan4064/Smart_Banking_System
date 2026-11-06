package com.banking.account.controller;

import com.banking.account.dto.*;
import com.banking.account.service.AccountService;
import com.banking.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Tag(name = "Account Management", description = "APIs for managing digital banking accounts, balances, and ledger")
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    @Operation(summary = "Create a new bank account")
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @Valid @RequestBody CreateAccountRequest request) {
        log.info("REST: Create account requested for customer: {}", request.getCustomerId());
        AccountResponse response = accountService.createAccount(request);
        return new ResponseEntity<>(ApiResponse.success("Account created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{accountNumber}")
    @Operation(summary = "Get account details by account number")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccount(
            @PathVariable String accountNumber) {
        AccountResponse response = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{accountNumber}/balance")
    @Operation(summary = "Get available balance for an account")
    public ResponseEntity<ApiResponse<BalanceResponse>> getBalance(
            @PathVariable String accountNumber) {
        BalanceResponse response = accountService.getAccountBalance(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{accountNumber}/ledger")
    @Operation(summary = "Get transaction ledger entries for an account")
    public ResponseEntity<ApiResponse<List<LedgerEntryResponse>>> getLedger(
            @PathVariable String accountNumber) {
        List<LedgerEntryResponse> entries = accountService.getAccountLedger(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(entries));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get all accounts owned by a specific customer")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getCustomerAccounts(
            @PathVariable String customerId) {
        List<AccountResponse> accounts = accountService.getAccountsByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.success(accounts));
    }

    @GetMapping("/admin/all")
    @Operation(summary = "Admin: Get all accounts across the banking system")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {
        List<AccountResponse> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.success(accounts));
    }

    @PutMapping("/{accountNumber}/status")
    @Operation(summary = "Admin: Block or unblock an account")
    public ResponseEntity<ApiResponse<AccountResponse>> updateStatus(
            @PathVariable String accountNumber,
            @Valid @RequestBody AccountStatusRequest request) {
        log.info("REST: Update status requested for account {} -> {}", accountNumber, request.getStatus());
        AccountResponse response = accountService.updateAccountStatus(
                accountNumber, request.getStatus(), request.getReason());
        return ResponseEntity.ok(ApiResponse.success("Account status updated to " + request.getStatus(), response));
    }

    @PostMapping("/{accountNumber}/debit")
    @Operation(summary = "Internal: Debit balance with idempotency guarantee")
    public ResponseEntity<ApiResponse<AccountResponse>> debitAccount(
            @PathVariable String accountNumber,
            @Valid @RequestBody DebitCreditRequest request) {
        log.info("REST: Debit requested for account {} with amount {}", accountNumber, request.getAmount());
        AccountResponse response = accountService.debitAccount(
                accountNumber,
                request.getAmount(),
                request.getTransactionReference(),
                request.getIdempotencyKey(),
                request.getDescription()
        );
        return ResponseEntity.ok(ApiResponse.success("Account debited successfully", response));
    }

    @PostMapping("/{accountNumber}/credit")
    @Operation(summary = "Internal: Credit balance with idempotency guarantee")
    public ResponseEntity<ApiResponse<AccountResponse>> creditAccount(
            @PathVariable String accountNumber,
            @Valid @RequestBody DebitCreditRequest request) {
        log.info("REST: Credit requested for account {} with amount {}", accountNumber, request.getAmount());
        AccountResponse response = accountService.creditAccount(
                accountNumber,
                request.getAmount(),
                request.getTransactionReference(),
                request.getIdempotencyKey(),
                request.getDescription()
        );
        return ResponseEntity.ok(ApiResponse.success("Account credited successfully", response));
    }
}
