package com.banking.fraud.service.rules;

import com.banking.common.event.TransactionInitiatedEvent;

import java.util.List;

public interface FraudRule {

    String getRuleName();

    int evaluate(TransactionInitiatedEvent event, List<String> triggeredRules);
}

