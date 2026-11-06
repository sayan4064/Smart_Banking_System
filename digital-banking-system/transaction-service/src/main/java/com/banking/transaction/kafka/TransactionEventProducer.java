package com.banking.transaction.kafka;

import com.banking.common.event.BaseEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishEvent(String topic, String key, BaseEvent event) {
        log.info("Publishing event to topic [{}] for txn ref [{}]", topic, key);
        try {
            kafkaTemplate.send(topic, key, event).whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to send Kafka event to [{}]: {}", topic, ex.getMessage(), ex);
                } else {
                    log.info("Kafka event published to [{}] partition [{}] at offset [{}]",
                            topic,
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                }
            });
        } catch (Exception e) {
            log.error("Exception sending Kafka message to [{}]: {}", topic, e.getMessage(), e);
        }
    }
}

