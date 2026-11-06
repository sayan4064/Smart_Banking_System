package com.banking.common.exception;

public class ResourceNotFoundException extends BankingException {

    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND", 404);
    }
}

