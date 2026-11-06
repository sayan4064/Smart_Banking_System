package com.banking.common.exception;

public class InvalidOtpException extends BankingException {

    public InvalidOtpException(String message) {
        super(message, "INVALID_OTP", 400);
    }
}

