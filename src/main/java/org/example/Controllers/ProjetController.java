package org.example.Controllers;

import org.example.entities.Projet;
import org.example.entities.User;
import org.example.services.ProjetService;
import org.example.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// DTO pour la création de projet par encadrant
class ProjetParEncadrantRequest {
    public String titre;
    public String description;
    public String technologies;
    public String dateDebut;
    public String dateFin;
    public String organisme;
    public List<Long> etudiantsIds;
    public Long groupeId;
    public String mode; // "nouveau" ou "fusion"
    public Long referenceEtudiantId; // utilisé si mode = fusion
}

@RestController
@RequestMapping("/api/projets")
public class ProjetController {
    @Autowired
    private ProjetService projetService;
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public List<Projet> getAllProjets() {
        return projetService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Projet> getProjetById(@PathVariable Long id) {
        return projetService.findById(id);
    }

    @GetMapping("/mon-projet")
    public Optional<Projet> getMonProjet() {
        String email = getCurrentUserEmail();
        User etudiant = userService.findByEmail(email).orElse(null);
        if (etudiant == null) return Optional.empty();
        return projetService.getProjetByEtudiant(etudiant);
    }

    @PostMapping("/creer")
    public String creerProjet(@RequestBody Projet projet) {
        String email = getCurrentUserEmail();
        User etudiant = userService.findByEmail(email).orElse(null);
        if (etudiant == null) return "Utilisateur non trouvé";
        if (projetService.etudiantADejaUnProjet(etudiant)) {
            return "Vous avez déjà un projet";
        }
        // Nouvelle version : on crée une liste avec l'étudiant
        projet.setEtudiants(java.util.List.of(etudiant));
        projetService.save(projet);
        return "Projet créé avec succès";
    }

    @PostMapping("/creer-par-encadrant")
    public String creerProjetParEncadrant(@RequestBody ProjetParEncadrantRequest req) {
        String email = getCurrentUserEmail();
        User encadrant = userService.findByEmail(email).orElse(null);
        if (encadrant == null || encadrant.getRole() != User.Role.ENCADRANT) {
            return "Non autorisé";
        }
        List<User> etudiants = req.etudiantsIds.stream()
            .map(id -> userService.findById(id).orElse(null))
            .filter(u -> u != null)
            .toList();
        if (etudiants.isEmpty()) return "Aucun étudiant valide sélectionné";
        if ("fusion".equals(req.mode) && req.referenceEtudiantId != null) {
            // Mode fusion : garder le projet de l'étudiant de référence
            User refEtu = userService.findById(req.referenceEtudiantId).orElse(null);
            if (refEtu == null) return "Étudiant de référence introuvable";
            Optional<Projet> refProjetOpt = projetService.getProjetByEtudiant(refEtu);
            if (refProjetOpt.isEmpty()) return "Projet de référence introuvable";
            Projet refProjet = refProjetOpt.get();
            // Ajouter tous les étudiants sélectionnés à ce projet
            refProjet.setEtudiants(etudiants);
            if (req.groupeId != null) {
                refProjet.setGroupe(projetService.getGroupeById(req.groupeId).orElse(null));
            }
            projetService.save(refProjet);
            // Supprimer les autres projets des étudiants (sauf le projet de référence)
            for (User etu : etudiants) {
                if (!etu.getId().equals(req.referenceEtudiantId)) {
                    projetService.deleteProjetByEtudiant(etu);
                }
            }
            return "Projet partagé (fusion) mis à jour pour " + etudiants.size() + " étudiant(s)";
        } else {
            // Mode nouveau projet : supprimer tous les anciens projets
            for (User etu : etudiants) {
                projetService.deleteProjetByEtudiant(etu);
            }
            Projet projet = new Projet();
            projet.setTitre(req.titre);
            projet.setDescription(req.description);
            projet.setTechnologies(req.technologies);
            projet.setDateDebut(java.sql.Date.valueOf(req.dateDebut));
            projet.setDateFin(java.sql.Date.valueOf(req.dateFin));
            projet.setOrganisme(req.organisme);
            projet.setEtudiants(etudiants);
            if (req.groupeId != null) {
                projet.setGroupe(projetService.getGroupeById(req.groupeId).orElse(null));
            }
            projet.setStatut("EN_COURS");
            projetService.save(projet);
            return "Projet créé pour " + etudiants.size() + " étudiant(s)";
        }
    }

    @PutMapping("/modifier")
    public String modifierProjet(@RequestBody Projet projet) {
        String email = getCurrentUserEmail();
        User etudiant = userService.findByEmail(email).orElse(null);
        if (etudiant == null) return "Utilisateur non trouvé";
        Optional<Projet> monProjet = projetService.getProjetByEtudiant(etudiant);
        if (monProjet.isEmpty()) return "Aucun projet à modifier";
        Projet p = monProjet.get();
        p.setTitre(projet.getTitre());
        p.setDescription(projet.getDescription());
        p.setTechnologies(projet.getTechnologies());
        p.setDateDebut(projet.getDateDebut());
        p.setDateFin(projet.getDateFin());
        p.setOrganisme(projet.getOrganisme());
        projetService.save(p);
        return "Projet modifié avec succès";
    }

    @DeleteMapping("/mon-projet")
    public String supprimerMonProjet() {
        String email = getCurrentUserEmail();
        User etudiant = userService.findByEmail(email).orElse(null);
        if (etudiant == null) return "Utilisateur non trouvé";
        projetService.deleteProjetByEtudiant(etudiant);
        return "Projet supprimé";
    }

    // Endpoint : récupérer les projets encadrés par l'encadrant connecté
    @GetMapping("/encadrant/mes-projets")
    public List<Projet> getProjetsEncadres() {
        String email = getCurrentUserEmail();
        User encadrant = userService.findByEmail(email).orElse(null);
        if (encadrant == null) return List.of();
        return projetService.getProjetsByEncadrant(encadrant);
    }

    // Endpoint : changer le statut d'un projet (En cours, Terminé)
    @PutMapping("/{projetId}/changer-statut")
    public Projet changerStatutProjet(@PathVariable Long projetId, @RequestParam String statut) {
        return projetService.changerStatutProjet(projetId, statut);
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
} 