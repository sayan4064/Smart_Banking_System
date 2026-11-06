package com.banking.notification.service.impl;

import com.banking.notification.model.NotificationItem;
import com.banking.notification.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

    private final List<NotificationItem> inbox = new CopyOnWriteArrayList<>();

    @Override
    public void dispatch(NotificationItem item) {
        log.info("DISPATCHING NOTIFICATION [{}]: To: {}, Title: '{}', Message: '{}'",
                item.getType(), item.getRecipient(), item.getTitle(), item.getMessage());
        inbox.add(0, item);
    }

    @Override
    public List<NotificationItem> getNotifications(String recipient) {
        if (recipient == null || recipient.isBlank() || "ALL".equalsIgnoreCase(recipient)) {
            return new ArrayList<>(inbox);
        }
        return inbox.stream()
                .filter(n -> recipient.equalsIgnoreCase(n.getRecipient()) || "BROADCAST".equalsIgnoreCase(n.getRecipient()))
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(String id) {
        inbox.stream()
                .filter(n -> n.getId().equals(id))
                .findFirst()
                .ifPresent(n -> n.setRead(true));
    }

    @Override
    public void markAllAsRead(String recipient) {
        inbox.stream()
                .filter(n -> recipient == null || recipient.equalsIgnoreCase(n.getRecipient()) || "ALL".equalsIgnoreCase(recipient))
                .forEach(n -> n.setRead(true));
    }
}

