package com.banking.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TransactionOtpRequiredEvent extends BaseEvent {

    private static final long serialVersionUID = 1L;

    private String senderAccountNumber;
    private String maskedPhoneNumber;
    private long expiresInSeconds;
    private int maxAttempts;
}

