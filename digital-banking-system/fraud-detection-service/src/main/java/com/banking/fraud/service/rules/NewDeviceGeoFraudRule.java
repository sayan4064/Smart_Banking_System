package com.banking.fraud.service.rules;

import com.banking.common.event.TransactionInitiatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@Order(5)
public class NewDeviceGeoFraudRule implements FraudRule {

    private static final BigDecimal CRITICAL_WIRE_THRESHOLD = BigDecimal.valueOf(100000);
    private static final int RISK_SCORE_PENALTY = 25;

    @Override
    public String getRuleName() {
        return "Rule 5: High Value / Channel Anomaly";
    }

    @Override
    public int evaluate(TransactionInitiatedEvent event, List<String> triggeredRules) {
        if (event.getAmount() != null && event.getAmount().compareTo(CRITICAL_WIRE_THRESHOLD) >= 0) {
            log.warn("High value channel anomaly triggered for txn {}: Amount {}",
                    event.getTransactionReference(), event.getAmount());
            triggeredRules.add(getRuleName() + " (Threshold: " + CRITICAL_WIRE_THRESHOLD + " INR)");
            return RISK_SCORE_PENALTY;
        }
        return 0;
    }
}
