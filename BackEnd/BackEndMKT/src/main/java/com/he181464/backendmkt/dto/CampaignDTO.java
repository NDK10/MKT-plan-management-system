package com.he181464.backendmkt.dto;


import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignDTO {

    private Long id;


    private String code;


    private String name;

    private String status;

    private LocalDateTime dateStart;

    private LocalDateTime dateComplete;

    private Long userResponsible;

    private String description;

    private BigDecimal price;

    private BigDecimal incurredCosts;

    private String target;


    private BigDecimal percentTarget;

    private String slogan;

    private String fileUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<Long> accountIds;

    private String userResponsibleName;

    private String userResponsibleEmail;

    private List<AccountResponseDto> accountResponseDtoList;
}
