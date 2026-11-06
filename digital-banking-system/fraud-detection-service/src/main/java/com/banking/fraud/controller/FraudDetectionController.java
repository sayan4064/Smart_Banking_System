package com.banking.fraud.controller;

import com.banking.common.dto.ApiResponse;
import com.banking.common.event.TransactionInitiatedEvent;
import com.banking.fraud.model.FraudAlertRecord;
import com.banking.fraud.service.FraudDetectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/fraud")
@RequiredArgsConstructor
@Tag(name = "Fraud Detection", description = "Real-time risk scoring, 5-rule fraud evaluation, and administrative alert inspection")
public class FraudDetectionController {

    private final FraudDetectionService fraudDetectionService;

    @PostMapping("/evaluate")
    @Operation(summary = "Evaluate transaction risk score using the 5-rule heuristic engine")
    public ResponseEntity<ApiResponse<FraudAlertRecord>> evaluate(
            @RequestBody TransactionInitiatedEvent event) {
        log.info("REST: Manual fraud evaluation requested for {}", event.getTransactionReference());
        FraudAlertRecord result = fraudDetectionService.evaluateTransaction(event);
        return ResponseEntity.ok(ApiResponse.success("Evaluation completed", result));
    }

    @GetMapping("/admin/alerts")
    @Operation(summary = "Admin: Retrieve recent fraud detection alerts and evaluation records")
    public ResponseEntity<ApiResponse<List<FraudAlertRecord>>> getAlerts() {
        List<FraudAlertRecord> alerts = fraudDetectionService.getAllAlerts();
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @GetMapping("/admin/statistics")
    @Operation(summary = "Admin: Get real-time fraud engine metrics, accuracy, and rule trigger counts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics() {
        Map<String, Object> stats = fraudDetectionService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}

