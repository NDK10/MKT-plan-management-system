package com.he181464.backendmkt.AIService;

import com.he181464.backendmkt.repository.OpenAiApiKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class OpenAiKeyService {

    private final OpenAiApiKeyRepository repository;

    private AtomicInteger counter = new AtomicInteger(0);

    public synchronized OpenAiApiKey getNextKey() {

        List<OpenAiApiKey> keys = repository.findAvailableKeys();

        if (keys.isEmpty()) {
            throw new RuntimeException("No API key available");
        }

        int index = counter.getAndIncrement() % keys.size();

        OpenAiApiKey key = keys.get(index);

        key.setLastUsedAt(LocalDateTime.now());
        key.setUsageCount(
                Optional.ofNullable(key.getUsageCount()).orElse(0L) + 1
        );

        repository.save(key);

        return key;
    }

    public void markRateLimited(OpenAiApiKey key) {
        key.setRateLimitedAt(LocalDateTime.now());
        repository.save(key);
    }

    public OpenAiApiKey getFirstKey() {
        List<OpenAiApiKey> keys = repository.findById(1L).orElse(null) != null
                ? List.of(repository.findById(1L).get())
                : List.of();
        if (keys.isEmpty()) {
            throw new RuntimeException("No API key available");
        }
        return keys.get(0);
    }
}
