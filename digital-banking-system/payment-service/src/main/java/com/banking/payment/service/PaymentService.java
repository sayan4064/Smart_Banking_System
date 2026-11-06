package com.banking.payment.service;

import com.banking.payment.dto.*;

import java.util.List;

public interface PaymentService {

    PaymentOrderResponse createOrder(CreatePaymentOrderRequest request);

    PaymentVerificationResponse verifyPayment(VerifyPaymentRequest request);

    void handleWebhook(String payload, String signature);

    List<PaymentOrderSummaryDto> getPaymentHistory();

    List<PaymentOrderSummaryDto> getAccountPaymentHistory(String accountNumber);
}
