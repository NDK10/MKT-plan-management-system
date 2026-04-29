package com.he181464.backendmkt.controller;

import com.he181464.backendmkt.dto.AccountDto;
import com.he181464.backendmkt.model.request.AccountRequest;
import com.he181464.backendmkt.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@PreAuthorize("hasAuthority('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/search")
    public ResponseEntity<Object> searchAccounts(@RequestBody AccountRequest accountRequest) {
        try {
            return ResponseEntity.ok(accountService.searchAccounts(accountRequest));
        } catch (Exception e) {
            log.error("Error searching accounts: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error searching accounts: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createAccount(@RequestBody AccountDto accountDto) {
        try {
            boolean created = accountService.createAccount(accountDto);
            if (created) {
                return ResponseEntity.ok("Account created successfully");
            } else {
                return ResponseEntity.badRequest().body("Failed to create account");
            }
        } catch (Exception e) {
            log.error("Error creating account: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error creating account: " + e.getMessage());
        }
    }

    @PutMapping("/update/{accountId}")
    public ResponseEntity<Object> updateAccount(@PathVariable long accountId, @RequestBody AccountDto accountDto) {
        try {
            AccountDto updatedAccount = accountService.updateAccount(accountDto, accountId);
            return ResponseEntity.ok(updatedAccount);
        } catch (Exception e) {
            log.error("Error updating account: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error updating account: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{accountId}")
    public ResponseEntity<Object> deleteAccount(@PathVariable long accountId) {
        try {
            accountService.deleteAccount(accountId);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting account: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LEADER')")
    public ResponseEntity<Object> getAllAccounts() {
        try {
            return ResponseEntity.ok(accountService.getAllAccount());
        } catch (Exception e) {
            log.error("Error fetching accounts: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error fetching accounts: " + e.getMessage());
        }
    }

    @GetMapping("/user-responsible")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LEADER')")
    public ResponseEntity<Object> getUserResponsible() {
        try {
            return ResponseEntity.ok(accountService.getUserResponsible());
        } catch (Exception e) {
            log.error("Error fetching user responsible accounts: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error fetching user responsible accounts: " + e.getMessage());
        }
    }

}
