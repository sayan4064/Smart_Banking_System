package com.banking.fraud.service.rules;

import com.banking.common.event.TransactionInitiatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Component
@Order(3)
public class BalanceDrainFraudRule implements FraudRule {

    private static final BigDecimal DRAIN_RATIO_THRESHOLD = BigDecimal.valueOf(0.90);
    private static final int RISK_SCORE_PENALTY = 30;

    @Override
    public String getRuleName() {
        return "Rule 3: High Balance Drain (>90% account balance)";
    }

    @Override
    public int evaluate(TransactionInitiatedEvent event, List<String> triggeredRules) {
        if (event.getSenderCurrentBalance() == null || event.getSenderCurrentBalance().compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }

        BigDecimal ratio = event.getAmount().divide(event.getSenderCurrentBalance(), 4, RoundingMode.HALF_UP);

        if (ratio.compareTo(DRAIN_RATIO_THRESHOLD) >= 0) {
            BigDecimal percent = ratio.multiply(BigDecimal.valueOf(100)).setScale(1, RoundingMode.HALF_UP);
            log.warn("Balance drain triggered for txn {}: Drains {}% of balance",
                    event.getTransactionReference(), percent);
            triggeredRules.add(getRuleName() + " (" + percent + "% of balance)");
            return RISK_SCORE_PENALTY;
        }
        return 0;
    }
}

