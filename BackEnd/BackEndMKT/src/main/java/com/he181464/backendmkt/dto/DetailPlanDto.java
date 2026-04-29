package com.he181464.backendmkt.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetailPlanDto {

    private Long id;
    private Long campaignId;
    private String campaignName;
    private String title;
    private String socialPlan;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timelineUp;


    private BigDecimal price;
    private String content;
    private String linkDrive;
    private Integer performerId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
