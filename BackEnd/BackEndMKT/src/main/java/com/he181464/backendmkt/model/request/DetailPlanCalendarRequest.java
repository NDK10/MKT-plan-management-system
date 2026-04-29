package com.he181464.backendmkt.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DetailPlanCalendarRequest {

    private Integer performerId;

    private Integer month;

    private Integer year;

}
