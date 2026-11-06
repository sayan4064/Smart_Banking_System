package com.banking.common.exception;

public class DuplicateTransactionException extends BankingException {

    public DuplicateTransactionException(String message) {
        super(message, "DUPLICATE_TRANSACTION", 409);
    }
}

