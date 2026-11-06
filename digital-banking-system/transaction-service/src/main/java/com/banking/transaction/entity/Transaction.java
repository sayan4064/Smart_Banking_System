package com.banking.transaction.entity;

import com.banking.common.constant.TransactionStatus;
import com.banking.common.constant.TransactionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_txn_reference", columnList = "transaction_reference", unique = true),
    @Index(name = "idx_sender_account", columnList = "sender_account_number"),
    @Index(name = "idx_receiver_account", columnList = "receiver_account_number"),
    @Index(name = "idx_txn_status", columnList = "transaction_status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_reference", nullable = false, unique = true, length = 64)
    private String transactionReference;

    @Column(name = "sender_account_number", nullable = false, length = 32)
    private String senderAccountNumber;

    @Column(name = "receiver_account_number", nullable = false, length = 32)
    private String receiverAccountNumber;

    @Column(name = "amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 8)
    @Builder.Default
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 32)
    @Builder.Default
    private TransactionType transactionType = TransactionType.TRANSFER;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status", nullable = false, length = 32)
    @Builder.Default
    private TransactionStatus transactionStatus = TransactionStatus.INITIATED;

    @Column(name = "description", length = 255)
    private String description;

    @CreationTimestamp
    @Column(name = "initiated_at", nullable = false, updatable = false)
    private LocalDateTime initiatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "failure_reason", length = 512)
    private String failureReason;

    @Version
    @Column(name = "version")
    private Long version;
}

