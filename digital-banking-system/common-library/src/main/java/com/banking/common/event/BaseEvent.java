package com.banking.common.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @lombok.Builder.Default
    private String eventId = UUID.randomUUID().toString();

    private String eventType;

    private String transactionReference;

    private String correlationId;

    @lombok.Builder.Default
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant timestamp = Instant.now();
}

