package com.banking.account.dto;

import com.banking.common.constant.AccountStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountStatusRequest {

    @NotNull(message = "Account status is required")
    private AccountStatus status;

    private String reason;
}
