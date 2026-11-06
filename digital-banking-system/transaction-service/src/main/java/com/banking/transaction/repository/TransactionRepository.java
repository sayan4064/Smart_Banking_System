package com.banking.transaction.repository;

import com.banking.common.constant.TransactionStatus;
import com.banking.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionReference(String transactionReference);

    List<Transaction> findBySenderAccountNumberOrReceiverAccountNumberOrderByInitiatedAtDesc(
            String sender, String receiver);

    List<Transaction> findAllByOrderByInitiatedAtDesc();

    List<Transaction> findByTransactionStatusOrderByInitiatedAtDesc(TransactionStatus status);
}
