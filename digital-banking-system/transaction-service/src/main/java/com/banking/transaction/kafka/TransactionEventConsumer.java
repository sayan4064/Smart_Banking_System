package com.banking.transaction.kafka;

import com.banking.common.constant.KafkaTopics;
import com.banking.common.event.*;
import com.banking.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventConsumer {

    private final TransactionService transactionService;

    @KafkaListener(topics = KafkaTopics.FRAUD_CHECK_PASSED, groupId = "transaction-service-group")
    public void handleFraudCheckPassed(FraudCheckPassedEvent event) {
        log.info("Kafka consumer: Fraud check passed for txn {}", event.getTransactionReference());
        try {
            transactionService.processFraudCheckPassed(event.getTransactionReference());
        } catch (Exception e) {
            log.error("Failed to process fraud check passed for {}: {}", event.getTransactionReference(), e.getMessage());
        }
    }

    @KafkaListener(topics = KafkaTopics.FRAUD_CHECK_FAILED, groupId = "transaction-service-group")
    public void handleFraudCheckFailed(FraudCheckFailedEvent event) {
        log.warn("Kafka consumer: Fraud check failed for txn {}", event.getTransactionReference());
        try {
            transactionService.processFraudCheckFailed(event.getTransactionReference(), event.getRejectionReason());
        } catch (Exception e) {
            log.error("Failed to process fraud check failed for {}: {}", event.getTransactionReference(), e.getMessage());
        }
    }

    @KafkaListener(topics = KafkaTopics.TRANSACTION_OTP_REQUIRED, groupId = "transaction-service-group")
    public void handleOtpRequired(TransactionOtpRequiredEvent event) {
        log.info("Kafka consumer: OTP required event for txn {}", event.getTransactionReference());
        try {
            transactionService.processOtpRequired(event.getTransactionReference());
        } catch (Exception e) {
            log.error("Failed to process OTP required for {}: {}", event.getTransactionReference(), e.getMessage());
        }
    }

    @KafkaListener(topics = KafkaTopics.TRANSACTION_REFUNDED, groupId = "transaction-service-group")
    public void handleRefunded(TransactionRefundedEvent event) {
        log.info("Kafka consumer: Transaction refunded event for txn {}", event.getTransactionReference());
        try {
            transactionService.processRefundCompleted(event.getTransactionReference());
        } catch (Exception e) {
            log.error("Failed to process refund event for {}: {}", event.getTransactionReference(), e.getMessage());
        }
    }

    @KafkaListener(topics = KafkaTopics.TRANSACTION_FAILED, groupId = "transaction-service-group")
    public void handleTransactionFailed(TransactionFailedEvent event) {
        log.warn("Kafka consumer: Transaction failed event for txn {}", event.getTransactionReference());
        try {
            transactionService.processFraudCheckFailed(event.getTransactionReference(), event.getFailureReason());
        } catch (Exception e) {
            log.error("Failed to process failed event for {}: {}", event.getTransactionReference(), e.getMessage());
        }
    }
}

