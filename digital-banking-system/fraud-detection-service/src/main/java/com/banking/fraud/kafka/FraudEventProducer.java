package com.banking.fraud.kafka;

import com.banking.common.event.BaseEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FraudEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishEvent(String topic, String key, BaseEvent event) {
        log.info("Fraud engine publishing event to [{}] for ref [{}]", topic, key);
        try {
            kafkaTemplate.send(topic, key, event).whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish fraud event to [{}]: {}", topic, ex.getMessage(), ex);
                } else {
                    log.info("Fraud event successfully emitted to [{}] offset [{}]",
                            topic, result.getRecordMetadata().offset());
                }
            });
        } catch (Exception e) {
            log.error("Exception emitting fraud event to [{}]: {}", topic, e.getMessage(), e);
        }
    }
}
