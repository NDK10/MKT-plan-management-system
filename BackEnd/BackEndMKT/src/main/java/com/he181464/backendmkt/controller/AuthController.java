package com.he181464.backendmkt.controller;

import com.he181464.backendmkt.dto.AccountDto;
import com.he181464.backendmkt.dto.LoginDto;
import com.he181464.backendmkt.dto.TokenDto;
import com.he181464.backendmkt.entity.Account;
import com.he181464.backendmkt.jwt.JwtService;
import com.he181464.backendmkt.repository.AccountRepository;
import com.he181464.backendmkt.service.AccountService;
import com.he181464.backendmkt.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthController {


    private final AuthenticationManager authenticationManager;

    private final UserDetailsService userDetailsService;

    private final AccountService accountService;

    private final JwtService jwtService;

    private final TokenService tokenService;

    private final AccountRepository accountRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AccountDto registerRequest) {
        boolean isRegistered = accountService.createAccount(registerRequest);
        if (isRegistered) {
            return ResponseEntity.ok("Registration successful");
        } else {
            return ResponseEntity.badRequest().body("Registration failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
            Account account = accountService.getAccountByEmailToGenerate2Fa(authRequest.getEmail());
            if (account.getStatus() == 0) {
                return ResponseEntity.status(436).body("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");
            }
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String accessToken = jwtService.generateAccessToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);
            tokenService.saveRefreshToken(userDetails.getUsername(), refreshToken);
            TokenDto tokenDto = new TokenDto(accessToken, refreshToken);
            return ResponseEntity.ok(tokenDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản hoặc mật khẩu");
        }

    }

    @PostMapping("/v1/public/refresh")
    public ResponseEntity<?> refresh(@RequestBody TokenDto request) {
        String refreshToken = request.getRefreshToken();

        try {
            String username = jwtService.extractUsername(refreshToken);


            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (!jwtService.isValidToken(refreshToken, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid refresh token");
            }

            // Sinh access token mới
            String newAccessToken = jwtService.generateAccessToken(userDetails);
            String newRefreshToken = jwtService.generateRefreshToken(userDetails);
            tokenService.saveRefreshToken(userDetails.getUsername(), newRefreshToken);
            TokenDto tokenDto = new TokenDto(newAccessToken, newRefreshToken);
            return ResponseEntity.ok(tokenDto);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Refresh token expired");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Cannot refresh token: " + e.getMessage());
        }
    }


    // Profile account student
    @GetMapping("/profileStudent")
    public ResponseEntity<AccountDto> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        Optional<Account> optionalAccount = accountRepository.findByEmail(email);
        if (optionalAccount.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Account account = optionalAccount.get();
        AccountDto dto = new AccountDto(
                account.getEmail(),
                account.getFullName(),
                account.getPassword(),
                account.getRoleId(),
                account.getPhoneNumber(),
                account.getAddress(),
                account.getDateOfBirth(),
                account.getStatus()
        );
        return ResponseEntity.ok(dto);
    }

    //cập nhật Profile
    @PutMapping("/profileStudent")
    public ResponseEntity<AccountDto> updateProfile(Authentication authentication, @RequestBody AccountDto accountDto) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        Optional<Account> optionalAccount = accountRepository.findByEmail(email);
        if (optionalAccount.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Account account = optionalAccount.get();
        AccountDto updatedAccountDto = accountService.updateAccount(accountDto, account.getId());
        return ResponseEntity.ok(updatedAccountDto);
    }

//    //Đổ mật khẩu
//    @PutMapping("/change-password")
//    public ResponseEntity<?> changePassword(Authentication authentication, @RequestBody ChangePasswordDTO changePasswordDTO) {
//        if (authentication == null || !authentication.isAuthenticated()) {
//            return ResponseEntity.status(401).body("Unauthorized");
//        }
//
//        if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
//            return ResponseEntity.badRequest().body("Mật Khẩu Không Khớp");
//        }
//        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//        String email = userDetails.getUsername();
//        Optional<Account> optionalAccount = accountRepository.findByEmail(email);
//        if (optionalAccount.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//        Account account = optionalAccount.get();
//        if (!accountService.passwordMatches(changePasswordDTO.getCurrentPassword(), account.getPassword())) {
//            return ResponseEntity.badRequest().body("Mật Khẩu Hiện Tại Không Đúng");
//        }
//        accountService.changePassword(account, changePasswordDTO.getNewPassword());
//        return ResponseEntity.ok().build();
//    }
//
//    @PostMapping("/v1/public/reset-password")
//    public ResponseEntity<?> resetPasswordRequest(@RequestBody ResetPasswordRequestDto requestDto) {
//        String newPass = emailService.sendMailResetPass(requestDto.getEmail());
//        accountService.resetPassword(requestDto.getEmail(), newPass);
//        return ResponseEntity.ok("Đã gửi mật khẩu mới đến email của bạn");
//    }
}
