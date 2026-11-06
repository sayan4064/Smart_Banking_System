package com.banking.common.constant;

public final class KafkaTopics {

    private KafkaTopics() {
        // Prevent instantiation
    }

    public static final String TRANSACTION_INITIATED = "transaction.initiated";
    public static final String FRAUD_CHECK_PASSED = "fraud.check.passed";
    public static final String FRAUD_CHECK_FAILED = "fraud.check.failed";
    public static final String TRANSACTION_OTP_REQUIRED = "transaction.otp.required";
    public static final String TRANSACTION_OTP_VERIFIED = "transaction.otp.verified";
    public static final String TRANSACTION_COMPLETED = "transaction.completed";
    public static final String TRANSACTION_FAILED = "transaction.failed";
    public static final String TRANSACTION_COMPENSATION_REQUESTED = "transaction.compensation.requested";
    public static final String TRANSACTION_REFUNDED = "transaction.refunded";
    public static final String PAYMENT_SUCCESS = "payment.success";
    public static final String PAYMENT_FAILED = "payment.failed";
    public static final String NOTIFICATION_REQUESTED = "notification.requested";
}

