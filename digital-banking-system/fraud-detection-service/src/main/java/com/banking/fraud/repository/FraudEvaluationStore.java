package com.banking.fraud.repository;

import com.banking.fraud.model.FraudAlertRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Repository
@RequiredArgsConstructor
public class FraudEvaluationStore {

    private final RedisTemplate<String, Object> redisTemplate;
    private final List<FraudAlertRecord> inMemoryStore = new CopyOnWriteArrayList<>();
    private final Map<String, List<Long>> inMemoryVelocity = new ConcurrentHashMap<>();
    private final Map<String, String> inMemoryLastTxn = new ConcurrentHashMap<>();

    private static final String ALERT_KEY_PREFIX = "fraud:alert:";
    private static final String VELOCITY_KEY_PREFIX = "fraud:velocity:";
    private static final String LAST_TXN_KEY_PREFIX = "fraud:last_txn:";

    public void saveAlert(FraudAlertRecord alert) {
        inMemoryStore.add(0, alert);
        try {
            String key = ALERT_KEY_PREFIX + alert.getTransactionReference();
            redisTemplate.opsForValue().set(key, alert, Duration.ofDays(7));
        } catch (Exception e) {
            log.warn("Redis unavailable for alert caching. Using in-memory fallback: {}", e.getMessage());
        }
    }

    public List<FraudAlertRecord> getAllAlerts() {
        return new ArrayList<>(inMemoryStore);
    }

    /**
     * Records transaction timestamp in sliding window for velocity tracking
     */
    public int recordAndCountVelocity(String accountNumber, int windowSeconds) {
        long now = System.currentTimeMillis();
        long windowStart = now - (windowSeconds * 1000L);

        try {
            String key = VELOCITY_KEY_PREFIX + accountNumber;
            redisTemplate.opsForZSet().add(key, String.valueOf(now), now);
            redisTemplate.opsForZSet().removeRangeByScore(key, 0, windowStart);
            redisTemplate.expire(key, Duration.ofSeconds(windowSeconds * 2L));
            Long count = redisTemplate.opsForZSet().zCard(key);
            return count != null ? count.intValue() : 1;
        } catch (Exception e) {
            // In-memory fallback
            List<Long> timestamps = inMemoryVelocity.computeIfAbsent(accountNumber, k -> new CopyOnWriteArrayList<>());
            timestamps.add(now);
            timestamps.removeIf(t -> t < windowStart);
            return timestamps.size();
        }
    }

    /**
     * Checks if identical transaction was sent in the last N seconds
     */
    public boolean checkAndRecordRapidRepeat(String senderAccount, String receiverAccount, String amount, int windowSeconds) {
        long now = System.currentTimeMillis();
        String signature = receiverAccount + ":" + amount;
        String key = LAST_TXN_KEY_PREFIX + senderAccount;

        try {
            Object last = redisTemplate.opsForValue().get(key);
            boolean isRepeat = false;
            if (last != null) {
                String[] parts = last.toString().split("\\|");
                if (parts.length == 2 && parts[0].equals(signature)) {
                    long lastTime = Long.parseLong(parts[1]);
                    if ((now - lastTime) <= (windowSeconds * 1000L)) {
                        isRepeat = true;
                    }
                }
            }
            redisTemplate.opsForValue().set(key, signature + "|" + now, Duration.ofSeconds(windowSeconds));
            return isRepeat;
        } catch (Exception e) {
            String last = inMemoryLastTxn.get(senderAccount);
            boolean isRepeat = false;
            if (last != null) {
                String[] parts = last.split("\\|");
                if (parts.length == 2 && parts[0].equals(signature)) {
                    long lastTime = Long.parseLong(parts[1]);
                    if ((now - lastTime) <= (windowSeconds * 1000L)) {
                        isRepeat = true;
                    }
                }
            }
            inMemoryLastTxn.put(senderAccount, signature + "|" + now);
            return isRepeat;
        }
    }
}
