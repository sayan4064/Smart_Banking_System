package com.banking.fraud.kafka;

import com.banking.common.constant.KafkaTopics;
import com.banking.common.event.TransactionInitiatedEvent;
import com.banking.fraud.service.FraudDetectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FraudEventConsumer {

    private final FraudDetectionService fraudDetectionService;

    @KafkaListener(topics = KafkaTopics.TRANSACTION_INITIATED, groupId = "fraud-detection-group")
    public void handleTransactionInitiated(TransactionInitiatedEvent event) {
        log.info("Fraud engine received TransactionInitiatedEvent for reference: {}", event.getTransactionReference());
        try {
            fraudDetectionService.evaluateTransaction(event);
        } catch (Exception e) {
            log.error("Error during real-time fraud evaluation for txn {}: {}",
                    event.getTransactionReference(), e.getMessage(), e);
        }
    }
}
