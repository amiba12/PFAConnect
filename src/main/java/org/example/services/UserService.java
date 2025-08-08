package org.example.services;

import org.example.entities.User;
import org.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> findUsersByEnabled(boolean enabled) {
        return userRepository.findAll().stream().filter(u -> u.isEnabled() == enabled).toList();
    }

    public User activerUtilisateur(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setEnabled(true);
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // Mettre à jour un utilisateur
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setNom(userDetails.getNom());
        user.setEmail(userDetails.getEmail());
        user.setTelephone(userDetails.getTelephone());
        user.setRole(userDetails.getRole());
        user.setEnabled(userDetails.isEnabled());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        return userRepository.save(user);
    }

    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
} 