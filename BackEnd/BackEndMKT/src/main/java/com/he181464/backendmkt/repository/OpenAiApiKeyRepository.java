package com.he181464.backendmkt.repository;

import com.he181464.backendmkt.AIService.OpenAiApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OpenAiApiKeyRepository
        extends JpaRepository<OpenAiApiKey, Long> {

    @Query("""
                SELECT k
                FROM OpenAiApiKey k
                WHERE k.status = 'ACTIVE'
                ORDER BY k.lastUsedAt ASC NULLS FIRST
            """)
    List<OpenAiApiKey> findAvailableKeys();

    Optional<OpenAiApiKey> findById(Long id);
}
