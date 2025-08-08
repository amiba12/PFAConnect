package org.example.config;

import org.example.entities.User;
import org.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .nom("Admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Compte admin par défaut créé : admin@gmail.com / admin123");
        }
    }
} 