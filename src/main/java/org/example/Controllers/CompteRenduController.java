package org.example.Controllers;

import org.example.entities.CompteRendu;
import org.example.services.CompteRenduService;
import org.example.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/compterendus")
public class CompteRenduController {
    @Autowired
    private CompteRenduService compteRenduService;
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public List<CompteRendu> getAllCompteRendus() {
        return compteRenduService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<CompteRendu> getCompteRenduById(@PathVariable Long id) {
        return compteRenduService.findById(id);
    }

    // Endpoint : lister les comptes-rendus d'un projet
    @GetMapping("/projet/{projetId}")
    public List<CompteRendu> getCompteRendusByProjet(@PathVariable Long projetId) {
        return compteRenduService.getCompteRendusByProjet(projetId);
    }

    // Endpoint : ajouter un compte-rendu à un projet (par l'encadrant connecté)
    @PostMapping("/ajouter/{projetId}")
    public CompteRendu ajouterCompteRendu(@PathVariable Long projetId, @RequestBody Map<String, String> body) {
        String email = getCurrentUserEmail();
        Long encadrantId = userService.findByEmail(email).map(u -> u.getId()).orElse(null);
        if (encadrantId == null) throw new RuntimeException("Encadrant non trouvé");
        String contenu = body.get("contenu");
        return compteRenduService.ajouterCompteRendu(projetId, encadrantId, contenu);
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
} 