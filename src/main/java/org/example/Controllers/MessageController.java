package org.example.Controllers;

import org.example.entities.Message;
import org.example.services.MessageService;
import org.example.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;
    @Autowired
    private UserService userService;

    // Endpoint : ajouter un message à un projet (étudiant ou encadrant connecté)
    @PostMapping("/ajouter/{projetId}")
    public Message ajouterMessage(@PathVariable Long projetId, @RequestBody Map<String, String> body) {
        String email = getCurrentUserEmail();
        Long auteurId = userService.findByEmail(email).map(u -> u.getId()).orElse(null);
        if (auteurId == null) throw new RuntimeException("Utilisateur non trouvé");
        String contenu = body.get("contenu");
        return messageService.ajouterMessage(projetId, auteurId, contenu);
    }

    // Endpoint : récupérer les messages d'un projet
    @GetMapping("/projet/{projetId}")
    public List<Message> getMessagesByProjet(@PathVariable Long projetId) {
        return messageService.getMessagesByProjet(projetId);
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
} 