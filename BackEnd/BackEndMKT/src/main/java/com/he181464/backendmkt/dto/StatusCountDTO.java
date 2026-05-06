package com.he181464.backendmkt.dto;

public class StatusCountDTO {

    private String status;
    private Long count;

    public StatusCountDTO(String status, Long count) {
        this.status = status;
        this.count = count;
    }

    public String getStatus() {
        return status;
    }

    public Long getCount() {
        return count;
    }
}
