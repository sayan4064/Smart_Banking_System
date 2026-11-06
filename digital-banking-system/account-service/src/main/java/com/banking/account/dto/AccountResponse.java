package com.banking.account.dto;

import com.banking.common.constant.AccountStatus;
import com.banking.common.constant.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {

    private Long id;
    private String accountNumber;
    private String customerId;
    private String accountHolderName;
    private String email;
    private String phoneNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private String currency;
    private AccountStatus accountStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

