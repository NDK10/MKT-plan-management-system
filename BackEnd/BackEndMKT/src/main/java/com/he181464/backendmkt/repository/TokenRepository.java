package com.he181464.backendmkt.repository;

import com.he181464.backendmkt.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String token);

    @Query("select t from Token t where t.accountId = :accountId " +
            "and t.revoked = 0 " +
            "and t.expired = 0")
    List<Token> findAllValidTokenByAccountId(@Param("accountId") Long accountId);


}
