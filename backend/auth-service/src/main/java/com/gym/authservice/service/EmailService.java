package com.gym.authservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.reset-password-url}")
    private String resetPasswordUrl;

    public void sendResetPasswordEmail(String toEmail, String token) {
        String resetLink = resetPasswordUrl + "?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@fittech.com");
        message.setTo(toEmail);
        message.setSubject("FitTech - Reset Your Password");
        message.setText(
                "Hello,\n\n" +
                        "You requested to reset your password.\n\n" +
                        "Click the link below to reset your password:\n\n" +
                        resetLink + "\n\n" +
                        "This link expires in 15 minutes.\n\n" +
                        "If you didn't request this, ignore this email.\n\n" +
                        "FitTech Team"
        );
        mailSender.send(message);
    }
}