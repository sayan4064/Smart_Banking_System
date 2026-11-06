package com.banking.common.exception;

public class AccountBlockedException extends BankingException {

    public AccountBlockedException(String message) {
        super(message, "ACCOUNT_BLOCKED", 403);
    }
}

