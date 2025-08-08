package org.example.Controllers;

import org.example.entities.User;
import org.example.repositories.UserRepository;
import org.example.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        User user = userRepository.findByEmail(email).orElse(null);
        Map<String, String> response = new HashMap<>();
        if (user == null || !user.isEnabled()) {
            response.put("error", "Votre compte n'est pas encore activé par l'administrateur.");
            return response;
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwt = jwtUtil.generateToken(userDetails.getUsername());
        response.put("token", jwt);
        return response;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(false); // Compte en attente de validation
        return userRepository.save(user);
    }
} 