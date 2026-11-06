package com.banking.common.constant;

public enum TransactionStatus {
    INITIATED,
    PROCESSING,
    FRAUD_CHECK_PENDING,
    OTP_REQUIRED,
    OTP_VERIFIED,
    COMPLETED,
    FAILED,
    COMPENSATING,
    REFUNDED,
    CANCELLED
}

