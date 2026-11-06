package com.banking.notification.kafka;

import com.banking.common.constant.KafkaTopics;
import com.banking.common.event.*;
import com.banking.notification.model.NotificationItem;
import com.banking.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = KafkaTopics.TRANSACTION_OTP_REQUIRED, groupId = "notification-service-group")
    public void handleOtpRequired(TransactionOtpRequiredEvent event) {
        log.info("Notification Service: Dispatching OTP challenge alert for txn: {}", event.getTransactionReference());

        NotificationItem item = NotificationItem.builder()
                .id(UUID.randomUUID().toString())
                .recipient(event.getSenderAccountNumber())
                .title("Two-Factor Authentication Required")
                .message(String.format("A 6-digit OTP has been dispatched to %s for transaction %s. Valid for %d seconds.",
                        event.getMaskedPhoneNumber(), event.getTransactionReference(), event.getExpiresInSeconds()))
                .type("SECURITY")
                .read(false)
                .timestamp(Instant.now())
                .build();

        notificationService.dispatch(item);
    }

    @KafkaListener(topics = KafkaTopics.TRANSACTION_COMPLETED, groupId = "notification-service-group")
    public void handleTransactionCompleted(TransactionCompletedEvent event) {
        log.info("Notification Service: Dispatching transaction completion alert for txn: {}", event.getTransactionReference());

        NotificationItem debitAlert = NotificationItem.builder()
                .id(UUID.randomUUID().toString())
                .recipient(event.getSenderAccountNumber())
                .title("Money Transferred Successfully")
                .message(String.format("₹%s has been transferred from your account %s to %s (Ref: %s)",
                        event.getAmount(), event.getSenderAccountNumber(), event.getReceiverAccountNumber(), event.getTransactionReference()))
                .type("TRANSACTION")
                .read(false)
                .timestamp(Instant.now())
                .build();
        notificationService.dispatch(debitAlert);

        NotificationItem creditAlert = NotificationItem.builder()
                .id(UUID.randomUUID().toString())
                .recipient(event.getReceiverAccountNumber())
                .title("Funds Received")
                .message(String.format("₹%s has been credited to your account %s from %s (Ref: %s)",
                        event.getAmount(), event.getReceiverAccountNumber(), event.getSenderAccountNumber(), event.getTransactionReference()))
                .type("TRANSACTION")
                .read(false)
                .timestamp(Instant.now())
                .build();
        notificationService.dispatch(creditAlert);
    }

    @KafkaListener(topics = KafkaTopics.FRAUD_CHECK_FAILED, groupId = "notification-service-group")
    public void handleFraudCheckFailed(FraudCheckFailedEvent event) {
        log.warn("Notification Service: Dispatching fraud rejection security alert for txn: {}", event.getTransactionReference());

        NotificationItem item = NotificationItem.builder()
                .id(UUID.randomUUID().toString())
                .recipient(event.getTransactionReference())
                .title("Security Alert: Transaction Blocked")
                .message(String.format("Transaction %s was blocked by real-time fraud defense. Reason: %s",
                        event.getTransactionReference(), event.getRejectionReason()))
                .type("SECURITY")
                .read(false)
                .timestamp(Instant.now())
                .build();

        notificationService.dispatch(item);
    }

    @KafkaListener(topics = KafkaTopics.TRANSACTION_REFUNDED, groupId = "notification-service-group")
    public void handleTransactionRefunded(TransactionRefundedEvent event) {
        log.info("Notification Service: Dispatching refund confirmation alert for txn: {}", event.getTransactionReference());

        NotificationItem item = NotificationItem.builder()
                .id(UUID.randomUUID().toString())
                .recipient(event.getSenderAccountNumber())
                .title("Transfer Refund Processed")
                .message(String.format("Compensating transaction processed: ₹%s refunded to your account %s (Ref: %s)",
                        event.getAmount(), event.getSenderAccountNumber(), event.getTransactionReference()))
                .type("TRANSACTION")
                .read(false)
                .timestamp(Instant.now())
                .build();

        notificationService.dispatch(item);
    }

    @KafkaListener(topics = KafkaTopics.PAYMENT_SUCCESS, groupId = "notification-service-group")
    public void handlePaymentSuccess(PaymentSuccessEvent event) {
        log.info("Notification Service: Dispatching deposit success alert for account: {}", event.getAccountNumber());

        NotificationItem item = NotificationItem.builder()
                .id(UUID.randomUUID().toString())
                .recipient(event.getAccountNumber())
                .title("Deposit Confirmed via Razorpay")
                .message(String.format("₹%s successfully deposited into your account %s. Payment ID: %s",
                        event.getAmount(), event.getAccountNumber(), event.getRazorpayPaymentId()))
                .type("PAYMENT")
                .read(false)
                .timestamp(Instant.now())
                .build();

        notificationService.dispatch(item);
    }

    @KafkaListener(topics = KafkaTopics.NOTIFICATION_REQUESTED, groupId = "notification-service-group")
    public void handleCustomNotification(NotificationRequestedEvent event) {
        log.info("Notification Service: Dispatching custom notification to {}", event.getRecipient());

        NotificationItem item = NotificationItem.builder()
                .id(UUID.randomUUID().toString())
                .recipient(event.getRecipient())
                .title(event.getSubject())
                .message(event.getMessage())
                .type("SYSTEM")
                .read(false)
                .timestamp(Instant.now())
                .build();

        notificationService.dispatch(item);
    }
}

