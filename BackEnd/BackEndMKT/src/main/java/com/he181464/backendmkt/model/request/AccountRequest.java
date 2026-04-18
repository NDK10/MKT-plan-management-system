package com.he181464.backendmkt.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountRequest {

    private Integer roleId;
    private String email;
    private String phoneNumber;

    private Integer status;

    private Integer page;
    private Integer size;

}
