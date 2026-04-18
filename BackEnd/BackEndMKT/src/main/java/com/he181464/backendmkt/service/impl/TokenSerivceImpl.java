package com.he181464.backendmkt.service.impl;


import com.he181464.backendmkt.entity.Account;
import com.he181464.backendmkt.entity.Token;
import com.he181464.backendmkt.repository.AccountRepository;
import com.he181464.backendmkt.repository.TokenRepository;
import com.he181464.backendmkt.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class TokenSerivceImpl implements TokenService {

    private final AccountRepository accountRepository;

    private final TokenRepository tokenRepository;

    @Override
    public Token saveRefreshToken(String username, String rToken) {

        Account account = accountRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));

        Token token = Token.builder()
                .token(rToken)
                .accountId(account.getId())
                .tokenType("Bearer")
                .expired(0)
                .revoked(0)
                .expirationDate(LocalDate.now().plusDays(7).atStartOfDay())
                .build();


        return tokenRepository.save(token);
    }
}
