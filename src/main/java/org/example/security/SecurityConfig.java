package org.example.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/static/**", "/", "/index.html", "/favicon.ico").permitAll()
                .requestMatchers("/api/users/me").authenticated() // Autoriser tous les utilisateurs authentifiés
                // ENCADRANT
                .requestMatchers("/api/groupes/mes-groupes").hasAnyRole("ENCADRANT", "ADMIN")
                .requestMatchers("/api/groupes/*/etudiants").hasAnyRole("ENCADRANT", "ADMIN")
                // ADMIN
                .requestMatchers("/api/groupes/**").hasRole("ADMIN")
                .requestMatchers("/api/projets/").hasRole("ADMIN")
                // ENCADRANT
                .requestMatchers("/api/projets/encadrant/**").hasRole("ENCADRANT")
                .requestMatchers("/api/compterendus/**").hasAnyRole("ENCADRANT", "ETUDIANT")
                // ETUDIANT
                .requestMatchers("/api/projets/mon-projet").hasRole("ETUDIANT")
                .requestMatchers("/api/projets/mon-projet").hasRole("ETUDIANT")
                .requestMatchers("/api/rapports/**").hasRole("ETUDIANT")
                .requestMatchers("/api/projets/creer").hasRole("ETUDIANT")
                .requestMatchers("/api/projets/modifier/**").hasRole("ETUDIANT")
                .requestMatchers("/api/projets/creer-par-encadrant").hasRole("ENCADRANT")
                // COMMUN
                .requestMatchers("/api/messages/**").hasAnyRole("ETUDIANT", "ENCADRANT")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
} 