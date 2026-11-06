package com.banking.payment.controller;

import com.banking.common.dto.ApiResponse;
import com.banking.payment.dto.*;
import com.banking.payment.service.PaymentService;
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
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Management", description = "APIs for Razorpay Test Mode checkout, signature verification, and webhook handling")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @Operation(summary = "Create a Razorpay payment order for wallet deposit or balance top-up")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createOrder(
            @Valid @RequestBody CreatePaymentOrderRequest request) {
        log.info("REST: Create payment order requested for account {}", request.getAccountNumber());
        PaymentOrderResponse response = paymentService.createOrder(request);
        return new ResponseEntity<>(ApiResponse.success("Payment order created", response), HttpStatus.CREATED);
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay checkout payment signature and finalize deposit")
    public ResponseEntity<ApiResponse<PaymentVerificationResponse>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request) {
        log.info("REST: Payment verification requested for order {}", request.getOrderId());
        PaymentVerificationResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", response));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Handle asynchronous Razorpay server webhooks")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        log.info("REST: Razorpay webhook received");
        paymentService.handleWebhook(payload, signature);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/history")
    @Operation(summary = "Get global payment transactions ledger")
    public ResponseEntity<ApiResponse<List<PaymentOrderSummaryDto>>> getPaymentHistory() {
        List<PaymentOrderSummaryDto> history = paymentService.getPaymentHistory();
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/account/{accountNumber}")
    @Operation(summary = "Get payment history for a specific account number")
    public ResponseEntity<ApiResponse<List<PaymentOrderSummaryDto>>> getAccountPaymentHistory(
            @PathVariable String accountNumber) {
        List<PaymentOrderSummaryDto> history = paymentService.getAccountPaymentHistory(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}

