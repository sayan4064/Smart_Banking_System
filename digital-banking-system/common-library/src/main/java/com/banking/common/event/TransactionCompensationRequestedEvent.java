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
public class TransactionCompensationRequestedEvent extends BaseEvent {

    private static final long serialVersionUID = 1L;

    private String senderAccountNumber;
    private BigDecimal amount;
    private String currency;
    private String reason;
}

