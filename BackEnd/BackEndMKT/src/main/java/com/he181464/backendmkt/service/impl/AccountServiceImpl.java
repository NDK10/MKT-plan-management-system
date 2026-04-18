package com.he181464.backendmkt.service.impl;


import com.he181464.backendmkt.dto.AccountDto;
import com.he181464.backendmkt.dto.AccountResponseDto;
import com.he181464.backendmkt.entity.Account;
import com.he181464.backendmkt.exception.ObjectExistingException;
import com.he181464.backendmkt.model.mapper.AccountMapper;
import com.he181464.backendmkt.model.request.AccountRequest;
import com.he181464.backendmkt.repository.AccountRepository;
import com.he181464.backendmkt.repository.RoleRepository;
import com.he181464.backendmkt.service.AccountService;
import com.he181464.backendmkt.specification.AccountSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public boolean createAccount(AccountDto accountDto) {
        if (accountRepository.findByEmail(accountDto.getEmail()).isPresent()) {
            throw new ObjectExistingException("Email already exists");
        }
        Account account = new Account();
        account.setEmail(accountDto.getEmail());
        account.setPassword(passwordEncoder.encode(accountDto.getPassword()));
        account.setFullName(accountDto.getFullName());
        account.setPhoneNumber(accountDto.getPhoneNumber());
        account.setAddress(accountDto.getAddress());
        account.setRoleId(accountDto.getRoleId());
        account.setDateOfBirth(accountDto.getDateOfBirth());
        account.setStatus(1);
        account.setCreatedAt(LocalDateTime.now());
        accountRepository.save(account);
        return true;
    }

    @Override
    public Account getAccountByEmailToGenerate2Fa(String email) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        return account;
    }

    @Override
    public String get2FaSecretByEmail(String email) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        return account.getSecretCode();
    }


    @Override
    public AccountDto saveAccountSecretKey(Account account) {
        return accountMapper.toAccountDto(accountRepository.save(account));
    }

    @Override
    public Long getAccountIdByEmail(String email) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        return account.getId();
    }

    @Override
    @Transactional
    public AccountDto updateAccount(AccountDto accountDto, long accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        account.setFullName(accountDto.getFullName());
        account.setEmail(accountDto.getEmail());
        account.setPhoneNumber(accountDto.getPhoneNumber());
        account.setAddress(accountDto.getAddress());
        account.setDateOfBirth(accountDto.getDateOfBirth());
        account.setPassword(passwordEncoder.encode(accountDto.getPassword()));
        Account updatedAccount = accountRepository.save(account);
        return AccountDto.builder()
                .email(updatedAccount.getEmail())
                .fullName(updatedAccount.getFullName())
                .password(updatedAccount.getPassword())
                .roleId(updatedAccount.getRoleId())
                .phoneNumber(updatedAccount.getPhoneNumber())
                .address(updatedAccount.getAddress())
                .dateOfBirth(updatedAccount.getDateOfBirth())
                .status(updatedAccount.getStatus())
                .build();
    }

    @Override
    public boolean passwordMatches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    @Override
    @Transactional
    public void changePassword(Account account, String newPassword) {
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
    }

    @Override
    @Transactional
    public void resetPassword(String email, String newPassword) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        account.setPassword(passwordEncoder.encode(newPassword));
        account.setSecretCode(null);
        accountRepository.save(account);
    }

    @Override
    public Page<AccountResponseDto> searchAccounts(AccountRequest accountRequest) {
        Specification<Account> spec = AccountSpecification.hasEmail(accountRequest.getEmail())
                .and(AccountSpecification.hasPhone(accountRequest.getPhoneNumber()))
                .and(AccountSpecification.hasStatus(accountRequest.getStatus()))
                .and(AccountSpecification.hasRoleId(accountRequest.getRoleId()));


        Pageable pageable = PageRequest.of(
                accountRequest.getPage(),
                accountRequest.getSize()
        );

        return accountRepository.findAll(spec, pageable).map(accountMapper::toDTO);
    }

    @Override
    @Transactional
    public void deleteAccount(long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        account.setStatus(0);
        accountRepository.save(account);
    }


    @Override
    public List<AccountResponseDto> getAllAccount() {
        return accountRepository.findByStatusAndRoleId(1, 2L).stream().map(accountMapper::toDTO).toList();
    }


}
