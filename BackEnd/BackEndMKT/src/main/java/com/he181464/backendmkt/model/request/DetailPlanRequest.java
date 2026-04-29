package com.he181464.backendmkt.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DetailPlanRequest {

    private Long campaignId;

    private String title;

    private String status;

    private Integer performerId;

    private Integer page;

    private Integer size;
}
