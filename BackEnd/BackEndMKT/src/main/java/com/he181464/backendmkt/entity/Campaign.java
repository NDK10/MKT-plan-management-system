package com.he181464.backendmkt.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "campaign")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", length = 50, nullable = false, unique = true)
    private String code;

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "date_start")
    private LocalDateTime dateStart;

    @Column(name = "date_complete")
    private LocalDateTime dateComplete;

    // Nếu chưa map User thì cứ để Long trước
    @Column(name = "user_responsible")
    private Long userResponsible;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "incurred_costs", precision = 15, scale = 2)
    private BigDecimal incurredCosts;

    @Column(name = "target", columnDefinition = "TEXT")
    private String target;

    @Column(name = "percent_target", precision = 5, scale = 2)
    private BigDecimal percentTarget;

    @Column(name = "slogan", length = 500)
    private String slogan;

    @Column(name = "file_url", length = 1000)
    private String fileUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Auto set thời gian
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CampaignAccount> campaignAccounts;
}