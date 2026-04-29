package com.he181464.backendmkt.service;



import com.he181464.backendmkt.dto.AccountDto;
import com.he181464.backendmkt.dto.AccountResponseDto;
import com.he181464.backendmkt.entity.Account;
import com.he181464.backendmkt.model.request.AccountRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;


public interface AccountService {

    boolean createAccount(AccountDto accountDto);

    List<AccountResponseDto> getAllAccount();

    Long getAccountIdByEmail(String email);

    Account getAccountByEmailToGenerate2Fa(String email);

    String get2FaSecretByEmail(String email);

    AccountDto saveAccountSecretKey(Account account);

    AccountDto updateAccount(AccountDto accountDto,long accountId);

    boolean passwordMatches(String rawPassword, String encodedPassword);

    void changePassword(Account account,String newPassword);

    void resetPassword(String email, String newPassword);

    Page<AccountResponseDto> searchAccounts(AccountRequest accountRequest);

    void deleteAccount(long accountId);

    List<AccountResponseDto> getUserResponsible();



}
