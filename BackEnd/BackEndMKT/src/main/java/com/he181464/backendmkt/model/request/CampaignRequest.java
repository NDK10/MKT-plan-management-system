package com.he181464.backendmkt.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CampaignRequest {

    private String code;

    private String name;

    private String status;

    private BigDecimal price;

    private Long userResponsible;

    private Integer page;

    private Integer size;


}
