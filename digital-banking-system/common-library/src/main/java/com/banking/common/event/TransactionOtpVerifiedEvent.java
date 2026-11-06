package com.banking.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TransactionOtpVerifiedEvent extends BaseEvent {

    private static final long serialVersionUID = 1L;

    private String senderAccountNumber;
    private Instant verifiedAt;
}

