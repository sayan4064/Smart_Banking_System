package com.banking.transaction.dto;

import com.banking.common.constant.TransactionStatus;
import com.banking.common.constant.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Long id;
    private String transactionReference;
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private BigDecimal amount;
    private String currency;
    private TransactionType transactionType;
    private TransactionStatus transactionStatus;
    private String description;
    private LocalDateTime initiatedAt;
    private LocalDateTime completedAt;
    private String failureReason;
    private List<SagaStepDto> sagaSteps;
}
