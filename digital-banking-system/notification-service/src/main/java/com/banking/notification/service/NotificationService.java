package com.banking.notification.service;

import com.banking.notification.model.NotificationItem;

import java.util.List;

public interface NotificationService {

    void dispatch(NotificationItem item);

    List<NotificationItem> getNotifications(String recipient);

    void markAsRead(String id);

    void markAllAsRead(String recipient);
}
