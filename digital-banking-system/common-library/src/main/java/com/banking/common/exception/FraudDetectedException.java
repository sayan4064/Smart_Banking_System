package com.banking.common.exception;

public class FraudDetectedException extends BankingException {

    public FraudDetectedException(String message) {
        super(message, "FRAUD_DETECTED", 403);
    }
}

