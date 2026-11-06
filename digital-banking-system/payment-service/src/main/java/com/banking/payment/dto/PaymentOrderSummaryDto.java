package com.banking.payment.dto;

import com.banking.common.constant.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderSummaryDto {

    private Long id;
    private String orderId;
    private String paymentId;
    private String accountNumber;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String receipt;
    private String failureReason;
    private LocalDateTime createdAt;
}
