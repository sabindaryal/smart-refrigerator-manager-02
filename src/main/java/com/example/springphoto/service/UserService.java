package com.example.springphoto.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.springphoto.model.User;
import com.example.springphoto.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpEmailService emailService;
    private final SecureRandom random = new SecureRandom();

    public void registerUser(String username, String email, String password) {
        String normalized = username == null ? "" : username.trim();
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
        if (normalized.length() < 3 || normalized.length() > 40) throw new IllegalArgumentException("Username must be 3 to 40 characters.");
        if (!normalizedEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) throw new IllegalArgumentException("Enter a valid email address.");
        if (password == null || password.length() < 8) throw new IllegalArgumentException("Password must contain at least 8 characters.");
        if (userRepository.findByUsername(normalized).isPresent()) throw new IllegalArgumentException("That username is already in use.");
        if (userRepository.findByEmail(normalizedEmail).isPresent()) throw new IllegalArgumentException("That email address is already registered.");
        User user = new User(); user.setUsername(normalized); user.setEmail(normalizedEmail); user.setDisplayName(normalized);
        user.setPassword(passwordEncoder.encode(password)); user.setEnabled(true); userRepository.save(user);
    }

    @Transactional
    public void requestPasswordReset(String email) {
        userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT)).ifPresent(user -> {
            String code = String.format("%06d", random.nextInt(1_000_000));
            user.setResetCodeHash(passwordEncoder.encode(code)); user.setResetCodeExpiresAt(LocalDateTime.now().plusMinutes(10));
            userRepository.save(user); emailService.send(user.getEmail(), code);
        });
    }

    @Transactional
    public void resetPassword(String email, String code, String password) {
        User user = userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT)).orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset code."));
        if (user.getResetCodeExpiresAt() == null || user.getResetCodeExpiresAt().isBefore(LocalDateTime.now()) || user.getResetCodeHash() == null || !passwordEncoder.matches(code, user.getResetCodeHash()))
            throw new IllegalArgumentException("Invalid or expired reset code.");
        if (password == null || password.length() < 8) throw new IllegalArgumentException("Password must contain at least 8 characters.");
        user.setPassword(passwordEncoder.encode(password)); user.setResetCodeHash(null); user.setResetCodeExpiresAt(null); userRepository.save(user);
    }

    @Transactional
    public User updateProfile(User user, String displayName, String language) {
        if (displayName == null || displayName.isBlank() || displayName.trim().length() > 60) throw new IllegalArgumentException("Display name is required and must be 60 characters or fewer.");
        if (!"en".equals(language) && !"ja".equals(language)) throw new IllegalArgumentException("Unsupported language.");
        user.setDisplayName(displayName.trim()); user.setPreferredLanguage(language); return userRepository.save(user);
    }
}
