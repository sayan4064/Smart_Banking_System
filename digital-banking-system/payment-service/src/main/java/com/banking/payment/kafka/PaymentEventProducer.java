package com.banking.payment.kafka;

import com.banking.common.event.BaseEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishEvent(String topic, String key, BaseEvent event) {
        log.info("Payment service publishing event to [{}] with key [{}]", topic, key);
        try {
            kafkaTemplate.send(topic, key, event).whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish payment event to [{}]: {}", topic, ex.getMessage(), ex);
                } else {
                    log.info("Payment event successfully published to [{}] offset [{}]",
                            topic, result.getRecordMetadata().offset());
                }
            });
        } catch (Exception e) {
            log.error("Exception publishing payment event: {}", e.getMessage(), e);
        }
    }
}

