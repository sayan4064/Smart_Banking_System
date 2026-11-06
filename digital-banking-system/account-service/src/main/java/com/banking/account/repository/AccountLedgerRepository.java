package com.banking.account.repository;

import com.banking.account.entity.AccountLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountLedgerRepository extends JpaRepository<AccountLedger, Long> {

    List<AccountLedger> findByAccountNumberOrderByCreatedAtDesc(String accountNumber);

    List<AccountLedger> findByTransactionReference(String transactionReference);
}

