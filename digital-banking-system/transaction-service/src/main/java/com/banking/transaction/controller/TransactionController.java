package com.banking.transaction.controller;

import com.banking.common.dto.ApiResponse;
import com.banking.transaction.dto.*;
import com.banking.transaction.service.TransactionService;
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
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction Management", description = "APIs for initiating transfers, verifying OTP challenges, and querying transaction histories")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    @Operation(summary = "Initiate a money transfer using Saga choreography")
    public ResponseEntity<ApiResponse<TransferResponse>> initiateTransfer(
            @Valid @RequestBody TransferRequest request) {
        log.info("REST: Transfer initiation requested from {} to {} for {}",
                request.getSenderAccountNumber(), request.getReceiverAccountNumber(), request.getAmount());
        TransferResponse response = transactionService.initiateTransfer(request);
        return new ResponseEntity<>(ApiResponse.success("Transfer initiated successfully", response), HttpStatus.ACCEPTED);
    }

    @GetMapping("/{reference}")
    @Operation(summary = "Get transaction details and Saga execution lifecycle by reference")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransaction(
            @PathVariable String reference) {
        TransactionResponse response = transactionService.getTransactionByReference(reference);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Query transactions with optional status, type, and keyword search filters")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {
        List<TransactionResponse> list = transactionService.getTransactions(status, type, search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/my-transactions")
    @Operation(summary = "Get customer's transaction history")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getMyTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {
        List<TransactionResponse> list = transactionService.getTransactions(status, type, search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/account/{accountNumber}")
    @Operation(summary = "Get transaction history for a specific account number")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAccountTransactions(
            @PathVariable String accountNumber) {
        List<TransactionResponse> list = transactionService.getAccountTransactions(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/admin/all")
    @Operation(summary = "Admin: Get global transactions stream")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAllTransactions() {
        List<TransactionResponse> list = transactionService.getAllTransactions();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{reference}/verify-otp")
    @Operation(summary = "Verify OTP code for a fraud-held or high-value transaction")
    public ResponseEntity<ApiResponse<TransferResponse>> verifyOtp(
            @PathVariable String reference,
            @Valid @RequestBody OtpVerifyRequest request) {
        log.info("REST: OTP verification requested for txn {}", reference);
        TransferResponse response = transactionService.verifyOtp(reference, request.getOtpCode());
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", response));
    }

    @PostMapping("/{reference}/resend-otp")
    @Operation(summary = "Resend a new 6-digit OTP code")
    public ResponseEntity<ApiResponse<TransferResponse>> resendOtp(
            @PathVariable String reference) {
        TransferResponse response = transactionService.resendOtp(reference);
        return ResponseEntity.ok(ApiResponse.success("New OTP dispatched", response));
    }
}
