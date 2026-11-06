package com.banking.fraud.service;

import com.banking.common.event.TransactionInitiatedEvent;
import com.banking.fraud.model.FraudAlertRecord;

import java.util.List;
import java.util.Map;

public interface FraudDetectionService {

    FraudAlertRecord evaluateTransaction(TransactionInitiatedEvent event);

    List<FraudAlertRecord> getAllAlerts();

    Map<String, Object> getStatistics();
}

