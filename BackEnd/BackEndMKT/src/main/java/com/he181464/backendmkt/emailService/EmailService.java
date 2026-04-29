package com.he181464.backendmkt.emailService;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public String sendMailResetPass(String to) {

        String fullText = "Bạn vừa được giao 1 nhiệm vụ mới, vui lòng truy cập vào hệ thống để xem chi tiết công việc.";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("lamch301104@gmail.com");
        message.setTo(to);
        message.setSubject("Thông báo nhiệm vụ mới");
        message.setText(fullText);
        mailSender.send(message);
        return fullText;
    }


}
