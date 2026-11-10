package com.example.springphoto.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.springphoto.service.LoggingOtpEmailService;
import com.example.springphoto.service.OtpEmailService;

@Configuration
public class OtpEmailConfig {
    @Bean
    @ConditionalOnMissingBean(OtpEmailService.class)
    OtpEmailService loggingOtpEmailService() { return new LoggingOtpEmailService(); }
}
