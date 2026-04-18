package com.he181464.backendmkt.service;


import com.he181464.backendmkt.entity.Token;

public interface TokenService {

    Token saveRefreshToken(String username, String rToken);
}
