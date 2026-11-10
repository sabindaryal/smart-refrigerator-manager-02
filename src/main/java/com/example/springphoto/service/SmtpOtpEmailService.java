package com.example.springphoto.service;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(prefix="spring.mail", name="host")
public class SmtpOtpEmailService implements OtpEmailService {
    private final JavaMailSender mailSender;
    public void send(String destination, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destination); message.setSubject("Smart Refrigerator Manager password reset");
        message.setText("Your password reset code is " + code + ". It expires in 10 minutes."); mailSender.send(message);
    }
}
