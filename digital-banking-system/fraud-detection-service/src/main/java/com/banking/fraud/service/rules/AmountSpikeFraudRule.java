package com.banking.fraud.service.rules;

import com.banking.common.event.TransactionInitiatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@Order(2)
public class AmountSpikeFraudRule implements FraudRule {

    private static final BigDecimal TYPICAL_HISTORICAL_AVERAGE = BigDecimal.valueOf(25000);
    private static final BigDecimal SPIKE_MULTIPLIER = BigDecimal.valueOf(3.0);
    private static final int RISK_SCORE_PENALTY = 30;

    @Override
    public String getRuleName() {
        return "Rule 2: Amount Spike Anomaly (>3.0x historical average)";
    }

    @Override
    public int evaluate(TransactionInitiatedEvent event, List<String> triggeredRules) {
        BigDecimal threshold = TYPICAL_HISTORICAL_AVERAGE.multiply(SPIKE_MULTIPLIER);

        if (event.getAmount() != null && event.getAmount().compareTo(threshold) > 0) {
            log.warn("Amount spike triggered for txn {}: Amount {} > Threshold {}",
                    event.getTransactionReference(), event.getAmount(), threshold);
            triggeredRules.add(getRuleName() + " (Amount: " + event.getAmount() + " > " + threshold + ")");
            return RISK_SCORE_PENALTY;
        }
        return 0;
    }
}
