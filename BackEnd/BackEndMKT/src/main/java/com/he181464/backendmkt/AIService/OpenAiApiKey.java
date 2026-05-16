package com.he181464.backendmkt.AIService;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "OPENAI_API_KEY")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OpenAiApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "API_KEY")
    private String apiKey;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "USAGE_COUNT")
    private Long usageCount;

    @Column(name = "LAST_USED_AT")
    private LocalDateTime lastUsedAt;

    @Column(name = "RATE_LIMITED_AT")
    private LocalDateTime rateLimitedAt;

    @Column(name = "FAIL_COUNT")
    private Integer failCount;

    @Column(name = "PRIORITY_ORDER")
    private Integer priorityOrder;
}
