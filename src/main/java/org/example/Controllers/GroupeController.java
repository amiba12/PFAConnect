package org.example.Controllers;

import org.example.entities.Groupe;
import org.example.entities.User;
import org.example.services.GroupeService;
import org.example.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groupes")
public class GroupeController {
    @Autowired
    private GroupeService groupeService;
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public List<Groupe> getAllGroupes() {
        return groupeService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Groupe> getGroupeById(@PathVariable Long id) {
        return groupeService.findById(id);
    }

    @PostMapping("/")
    public Groupe createGroupe(@RequestBody Groupe groupe) {
        return groupeService.save(groupe);
    }

    // Ajouter un étudiant à un groupe
    @PostMapping("/{groupeId}/ajouter-etudiant/{etudiantId}")
    public Groupe ajouterEtudiant(@PathVariable Long groupeId, @PathVariable Long etudiantId) {
        return groupeService.ajouterEtudiant(groupeId, etudiantId);
    }

    // Retirer un étudiant d'un groupe
    @PostMapping("/{groupeId}/retirer-etudiant/{etudiantId}")
    public Groupe retirerEtudiant(@PathVariable Long groupeId, @PathVariable Long etudiantId) {
        return groupeService.retirerEtudiant(groupeId, etudiantId);
    }

    // Associer un encadrant à un groupe
    @PostMapping("/{groupeId}/associer-encadrant/{encadrantId}")
    public Groupe associerEncadrant(@PathVariable Long groupeId, @PathVariable Long encadrantId) {
        return groupeService.associerEncadrant(groupeId, encadrantId);
    }

    // Récupérer les étudiants d'un groupe
    @GetMapping("/{groupeId}/etudiants")
    public List<User> getEtudiantsDuGroupe(@PathVariable Long groupeId) {
        return groupeService.getEtudiantsDuGroupe(groupeId);
    }

    // Récupérer l'encadrant d'un groupe
    @GetMapping("/{groupeId}/encadrant")
    public User getEncadrantDuGroupe(@PathVariable Long groupeId) {
        return groupeService.getEncadrantDuGroupe(groupeId);
    }

    @GetMapping("/mes-groupes")
    public List<Groupe> getMesGroupes() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User encadrant = userService.findByEmail(email).orElse(null);
        if (encadrant == null) return java.util.Collections.emptyList();
        return groupeService.findByEncadrantId(encadrant.getId());
    }
} 