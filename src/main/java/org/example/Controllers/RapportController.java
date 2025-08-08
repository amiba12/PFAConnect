package org.example.Controllers;

import org.example.entities.Rapport;
import org.example.services.RapportService;
import org.example.services.UserService;
import org.example.services.ProjetService;
import org.example.entities.User;
import org.example.entities.Projet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rapports")
public class RapportController {
    @Autowired
    private RapportService rapportService;
    @Autowired
    private UserService userService;
    @Autowired
    private ProjetService projetService;

    @GetMapping("/")
    public List<Rapport> getAllRapports() {
        return rapportService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Rapport> getRapportById(@PathVariable Long id) {
        return rapportService.findById(id);
    }

    // Endpoint : upload d'un rapport PDF et ajout du lien GitHub (par l'étudiant connecté)
    @PostMapping("/upload/{projetId}")
    public Rapport uploadRapport(@PathVariable Long projetId,
                                 @RequestParam("file") MultipartFile file,
                                 @RequestParam("lienGitHub") String lienGitHub) throws IOException {
        return rapportService.uploadRapport(projetId, file, lienGitHub);
    }

    // Endpoint : récupérer les rapports d'un projet
    @GetMapping("/projet/{projetId}")
    public List<Rapport> getRapportsByProjet(@PathVariable Long projetId) {
        return rapportService.getRapportsByProjet(projetId);
    }
} 