package com.banking.fraud.model;

import com.banking.common.constant.FraudDecision;
import com.banking.common.constant.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudAlertRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    private String transactionReference;
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private BigDecimal amount;
    private String currency;
    private int riskScore;
    private RiskLevel riskLevel;
    private FraudDecision decision;
    private List<String> triggeredRules;
    private Instant evaluatedAt;
}

