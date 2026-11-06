package com.banking.transaction.client;

import com.banking.common.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;

@FeignClient(name = "account-service", url = "${clients.account-service.url:http://localhost:8081}")
public interface AccountServiceClient {

    @GetMapping("/api/v1/accounts/{accountNumber}/balance")
    ApiResponse<AccountBalanceDto> getAccountBalance(@PathVariable("accountNumber") String accountNumber);

    @GetMapping("/api/v1/accounts/{accountNumber}")
    ApiResponse<AccountDetailsDto> getAccountDetails(@PathVariable("accountNumber") String accountNumber);

    record AccountBalanceDto(
            String accountNumber,
            BigDecimal balance,
            String currency,
            String status
    ) {}

    record AccountDetailsDto(
            Long id,
            String accountNumber,
            String customerId,
            String accountHolderName,
            String email,
            String phoneNumber,
            String accountType,
            BigDecimal balance,
            String currency,
            String accountStatus
    ) {}
}
