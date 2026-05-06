package com.he181464.backendmkt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CampaignCostDTO {
    private String name;
    private BigDecimal estimatedCost;
    private BigDecimal actualCost;
}
