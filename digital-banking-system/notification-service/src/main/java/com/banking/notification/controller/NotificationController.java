package com.banking.notification.controller;

import com.banking.common.dto.ApiResponse;
import com.banking.notification.model.NotificationItem;
import com.banking.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Center", description = "APIs for querying user alerts, transaction receipts, security warnings, and read-state management")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get user notifications and alerts")
    public ResponseEntity<ApiResponse<List<NotificationItem>>> getNotifications(
            @RequestParam(required = false) String recipient) {
        List<NotificationItem> list = notificationService.getNotifications(recipient);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a single notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read for a customer")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @RequestParam(required = false) String recipient) {
        notificationService.markAllAsRead(recipient);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}

