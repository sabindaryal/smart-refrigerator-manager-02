package com.example.springphoto.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String username;
    private String email;
    private String displayName;
    private String preferredLanguage = "ja";
    private String resetCodeHash;
    private java.time.LocalDateTime resetCodeExpiresAt;
    private String password;
    private boolean enabled;
}
