package com.banking.account.dto;

import com.banking.common.constant.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BalanceResponse {

    private String accountNumber;
    private BigDecimal balance;
    private String currency;
    private AccountStatus status;
}
