package com.banking.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Map;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class NotificationRequestedEvent extends BaseEvent {

    private static final long serialVersionUID = 1L;

    private String recipient;
    private String recipientEmail;
    private String recipientPhone;
    private String channel; // EMAIL, SMS, PUSH, CONSOLE
    private String subject;
    private String message;
    private String templateId;
    private Map<String, String> parameters;
}

