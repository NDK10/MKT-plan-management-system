package com.he181464.backendmkt.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "detail_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetailPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "social_plan")
    private String socialPlan;

    @Column(name = "timeline_up")
    private LocalDateTime timelineUp;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "link_drive")
    private String linkDrive;

    @Column(name = "performer_id")
    private Integer performerId;

    @Column(name = "status")
    private String status; // bạn đang để VARCHAR

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", insertable = false, updatable = false)
    private Campaign campaign;
}