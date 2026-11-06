package com.banking.common.exception;

public class InsufficientBalanceException extends BankingException {

    public InsufficientBalanceException(String message) {
        super(message, "INSUFFICIENT_BALANCE", 400);
    }
}

