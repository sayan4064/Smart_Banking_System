package com.banking.payment.repository;

import com.banking.payment.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

    Optional<PaymentOrder> findByOrderId(String orderId);

    Optional<PaymentOrder> findByPaymentId(String paymentId);

    List<PaymentOrder> findByAccountNumberOrderByCreatedAtDesc(String accountNumber);

    List<PaymentOrder> findAllByOrderByCreatedAtDesc();
}

