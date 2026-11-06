package com.banking.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PaymentSuccessEvent extends BaseEvent {

    private static final long serialVersionUID = 1L;

    private String paymentReference;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String accountNumber;
    private BigDecimal amount;
    private String currency;
}

