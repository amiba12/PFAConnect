package org.example.Controllers;

import org.example.entities.User;
import org.example.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<User> userOptional = userService.findByEmail(userEmail);
        return userOptional.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/")
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email);
    }

    @PostMapping("/")
    public User createUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true); // Activé par défaut si créé par un admin
        return userService.save(user);
    }

    @GetMapping("/en-attente")
    public List<User> getUsersEnAttente() {
        return userService.findUsersByEnabled(false);
    }

    @PutMapping("/activer/{id}")
    public User activerUtilisateur(@PathVariable Long id) {
        return userService.activerUtilisateur(id);
    }

    // Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.updateUser(id, userDetails);
    }

    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
} 