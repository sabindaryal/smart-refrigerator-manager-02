package com.example.springphoto.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
public class LoggingOtpEmailService implements OtpEmailService {
    private static final Logger log = LoggerFactory.getLogger(LoggingOtpEmailService.class);
    public void send(String destination, String code) { log.warn("SMTP is not configured. Development OTP for {}: {}", destination, code); }
}
