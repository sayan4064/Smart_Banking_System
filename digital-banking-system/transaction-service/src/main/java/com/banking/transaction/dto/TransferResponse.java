package com.banking.transaction.dto;

import com.banking.common.constant.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferResponse {

    private String transactionReference;
    private TransactionStatus status;
    private String message;
    private boolean requiresOtp;
}

