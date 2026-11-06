package com.banking.account.kafka;

import com.banking.common.event.BaseEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccountEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishEvent(String topic, String key, BaseEvent event) {
        log.info("Publishing event to topic: [{}] with key: [{}] and eventId: [{}]", topic, key, event.getEventId());
        try {
            kafkaTemplate.send(topic, key, event).whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish event to topic [{}]: {}", topic, ex.getMessage(), ex);
                } else {
                    log.info("Successfully published event to topic [{}] at offset [{}]",
                            topic, result.getRecordMetadata().offset());
                }
            });
        } catch (Exception e) {
            log.error("Exception while sending Kafka message: {}", e.getMessage(), e);
        }
    }
}
