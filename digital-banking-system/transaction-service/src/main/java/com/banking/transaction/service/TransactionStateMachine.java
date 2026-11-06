package com.banking.transaction.service;

import com.banking.common.constant.TransactionStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
public class TransactionStateMachine {

    private static final Map<TransactionStatus, Set<TransactionStatus>> VALID_TRANSITIONS = new EnumMap<>(TransactionStatus.class);

    static {
        // From INITIATED -> can transition to PROCESSING, CANCELLED, or FAILED
        VALID_TRANSITIONS.put(TransactionStatus.INITIATED, EnumSet.of(
                TransactionStatus.PROCESSING,
                TransactionStatus.CANCELLED,
                TransactionStatus.FAILED
        ));

        // From PROCESSING -> can transition to FRAUD_CHECK_PENDING, COMPENSATING, or FAILED
        VALID_TRANSITIONS.put(TransactionStatus.PROCESSING, EnumSet.of(
                TransactionStatus.FRAUD_CHECK_PENDING,
                TransactionStatus.COMPENSATING,
                TransactionStatus.FAILED
        ));

        // From FRAUD_CHECK_PENDING -> can transition to OTP_REQUIRED, COMPLETED, or COMPENSATING / FAILED
        VALID_TRANSITIONS.put(TransactionStatus.FRAUD_CHECK_PENDING, EnumSet.of(
                TransactionStatus.OTP_REQUIRED,
                TransactionStatus.COMPLETED,
                TransactionStatus.COMPENSATING,
                TransactionStatus.FAILED
        ));

        // From OTP_REQUIRED -> can transition to OTP_VERIFIED, COMPENSATING, or FAILED / CANCELLED
        VALID_TRANSITIONS.put(TransactionStatus.OTP_REQUIRED, EnumSet.of(
                TransactionStatus.OTP_VERIFIED,
                TransactionStatus.COMPENSATING,
                TransactionStatus.FAILED,
                TransactionStatus.CANCELLED
        ));

        // From OTP_VERIFIED -> can transition to COMPLETED, COMPENSATING, or FAILED
        VALID_TRANSITIONS.put(TransactionStatus.OTP_VERIFIED, EnumSet.of(
                TransactionStatus.COMPLETED,
                TransactionStatus.COMPENSATING,
                TransactionStatus.FAILED
        ));

        // From COMPENSATING -> can transition to REFUNDED or FAILED
        VALID_TRANSITIONS.put(TransactionStatus.COMPENSATING, EnumSet.of(
                TransactionStatus.REFUNDED,
                TransactionStatus.FAILED
        ));

        // Terminal states have no outbound transitions
        VALID_TRANSITIONS.put(TransactionStatus.COMPLETED, Collections.emptySet());
        VALID_TRANSITIONS.put(TransactionStatus.FAILED, Collections.emptySet());
        VALID_TRANSITIONS.put(TransactionStatus.REFUNDED, Collections.emptySet());
        VALID_TRANSITIONS.put(TransactionStatus.CANCELLED, Collections.emptySet());
    }

    /**
     * Validate whether a proposed transition is allowed by banking state rules.
     */
    public boolean canTransition(TransactionStatus from, TransactionStatus to) {
        if (from == to) return true; // Idempotent same-state
        Set<TransactionStatus> allowed = VALID_TRANSITIONS.getOrDefault(from, Collections.emptySet());
        return allowed.contains(to);
    }

    /**
     * Asserts valid state transition, throwing IllegalStateException on violation.
     */
    public void validateTransition(String txnRef, TransactionStatus current, TransactionStatus target) {
        if (!canTransition(current, target)) {
            String errorMsg = String.format("Illegal state transition for transaction %s: Cannot transition from %s to %s",
                    txnRef, current, target);
            log.error(errorMsg);
            throw new IllegalStateException(errorMsg);
        }
    }
}

