package com.banking.common.exception;

import lombok.Getter;

@Getter
public class BankingException extends RuntimeException {

    private final String errorCode;
    private final int status;

    public BankingException(String message, String errorCode, int status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public BankingException(String message, String errorCode) {
        this(message, errorCode, 400);
    }
}

