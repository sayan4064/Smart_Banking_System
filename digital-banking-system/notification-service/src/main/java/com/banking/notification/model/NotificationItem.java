package com.banking.notification.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String recipient;
    private String title;
    private String message;
    private String type; // TRANSACTION, SECURITY, PAYMENT, SYSTEM
    private boolean read;
    @Builder.Default
    private Instant timestamp = Instant.now();
    private Map<String, Object> metadata;
}
