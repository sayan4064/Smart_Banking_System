package com.banking.fraud.service.rules;

import com.banking.common.event.TransactionInitiatedEvent;
import com.banking.fraud.repository.FraudEvaluationStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class VelocityFraudRule implements FraudRule {

    private final FraudEvaluationStore store;
    private static final int WINDOW_SECONDS = 60;
    private static final int MAX_ALLOWED_TXNS = 5;
    private static final int RISK_SCORE_PENALTY = 40;

    @Override
    public String getRuleName() {
        return "Rule 1: Transaction Velocity (>5 txns/min)";
    }

    @Override
    public int evaluate(TransactionInitiatedEvent event, List<String> triggeredRules) {
        int recentCount = store.recordAndCountVelocity(event.getSenderAccountNumber(), WINDOW_SECONDS);
        log.debug("Velocity check for {}: {} txns in past {}s", event.getSenderAccountNumber(), recentCount, WINDOW_SECONDS);

        if (recentCount > MAX_ALLOWED_TXNS) {
            log.warn("Velocity fraud rule triggered for account {}. Count: {}", event.getSenderAccountNumber(), recentCount);
            triggeredRules.add(getRuleName() + " (" + recentCount + " in 60s)");
            return RISK_SCORE_PENALTY;
        }
        return 0;
    }
}
