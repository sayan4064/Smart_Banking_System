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
@Order(4)
@RequiredArgsConstructor
public class RapidRepeatsFraudRule implements FraudRule {

    private final FraudEvaluationStore store;
    private static final int REPEAT_WINDOW_SECONDS = 10;
    private static final int RISK_SCORE_PENALTY = 50;

    @Override
    public String getRuleName() {
        return "Rule 4: Rapid Consecutive Repeats (<10s identical amount & receiver)";
    }

    @Override
    public int evaluate(TransactionInitiatedEvent event, List<String> triggeredRules) {
        boolean isRapidRepeat = store.checkAndRecordRapidRepeat(
                event.getSenderAccountNumber(),
                event.getReceiverAccountNumber(),
                String.valueOf(event.getAmount()),
                REPEAT_WINDOW_SECONDS
        );

        if (isRapidRepeat) {
            log.warn("Rapid repeats rule triggered for txn {}: repeated transfer within {}s",
                    event.getTransactionReference(), REPEAT_WINDOW_SECONDS);
            triggeredRules.add(getRuleName());
            return RISK_SCORE_PENALTY;
        }
        return 0;
    }
}
