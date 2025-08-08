package org.example.services;

import org.example.entities.Rapport;
import org.example.entities.Projet;
import org.example.repositories.RapportRepository;
import org.example.repositories.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class RapportService {
    @Autowired
    private RapportRepository rapportRepository;
    @Autowired
    private ProjetRepository projetRepository;
    
    // Chemin absolu vers le dossier d'upload
    private final String uploadDir;
    
    public RapportService() {
        // Créer le chemin absolu vers le dossier d'upload
        String userDir = System.getProperty("user.dir");
        this.uploadDir = userDir + File.separator + "uploads" + File.separator + "rapports" + File.separator;
        
        // Créer le dossier une seule fois au démarrage
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (created) {
                System.out.println("✅ Dossier d'upload créé : " + uploadDir);
            } else {
                System.err.println("❌ Impossible de créer le dossier d'upload : " + uploadDir);
            }
        } else {
            System.out.println("✅ Dossier d'upload existe déjà : " + uploadDir);
        }
    }

    public Rapport save(Rapport rapport) {
        return rapportRepository.save(rapport);
    }

    public List<Rapport> findAll() {
        return rapportRepository.findAll();
    }

    public Optional<Rapport> findById(Long id) {
        return rapportRepository.findById(id);
    }

    // Upload d'un rapport PDF et ajout du lien GitHub
    public Rapport uploadRapport(Long projetId, MultipartFile file, String lienGitHub) throws IOException {
        Projet projet = projetRepository.findById(projetId).orElseThrow();
        
        // Sauvegarder le fichier localement
        String filePath = uploadDir + file.getOriginalFilename();
        file.transferTo(new File(filePath));
        
        System.out.println("📁 Fichier sauvegardé localement: " + filePath);
        System.out.println("🔗 Lien GitHub fourni: " + lienGitHub);
        
        Rapport rapport = new Rapport();
        rapport.setProjet(projet);
        rapport.setFichier(filePath);
        rapport.setLienGitHub(lienGitHub);
        return rapportRepository.save(rapport);
    }

    // Récupérer les rapports d'un projet
    public List<Rapport> getRapportsByProjet(Long projetId) {
        return rapportRepository.findAll().stream()
                .filter(r -> r.getProjet() != null && r.getProjet().getId().equals(projetId))
                .toList();
    }
} 