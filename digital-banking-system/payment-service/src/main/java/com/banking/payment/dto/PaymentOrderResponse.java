package com.banking.payment.dto;

import com.banking.common.constant.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderResponse {

    private String orderId;
    private String keyId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String receipt;
    private String accountNumber;
}

