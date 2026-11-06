package com.banking.payment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyPaymentRequest {

    @NotBlank(message = "Razorpay order ID is required")
    private String orderId;

    @NotBlank(message = "Razorpay payment ID is required")
    private String paymentId;

    @NotBlank(message = "Razorpay signature is required")
    private String signature;

    @NotBlank(message = "Account number is required")
    private String accountNumber;
}
