package org.example.services;

import org.example.entities.Projet;
import org.example.entities.User;
import org.example.repositories.ProjetRepository;
import org.example.repositories.GroupeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjetService {
    @Autowired
    private ProjetRepository projetRepository;
    @Autowired
    private GroupeRepository groupeRepository;

    public Projet save(Projet projet) {
        return projetRepository.save(projet);
    }

    public List<Projet> findAll() {
        return projetRepository.findAll();
    }

    public Optional<Projet> findById(Long id) {
        return projetRepository.findById(id);
    }

    public boolean etudiantADejaUnProjet(User etudiant) {
        return projetRepository.findAll().stream()
                .anyMatch(p -> p.getEtudiants() != null && p.getEtudiants().stream().anyMatch(e -> e.getId().equals(etudiant.getId())));
    }

    public Optional<Projet> getProjetByEtudiant(User etudiant) {
        return projetRepository.findAll().stream()
                .filter(p -> p.getEtudiants() != null && p.getEtudiants().stream().anyMatch(e -> e.getId().equals(etudiant.getId())))
                .findFirst();
    }

    public Optional<org.example.entities.Groupe> getGroupeById(Long id) {
        return groupeRepository.findById(id);
    }

    // Récupérer les projets encadrés par un encadrant
    public List<Projet> getProjetsByEncadrant(User encadrant) {
        return groupeRepository.findAll().stream()
                .filter(g -> g.getEncadrant() != null && g.getEncadrant().getId().equals(encadrant.getId()))
                .flatMap(g -> g.getEtudiants().stream())
                .map(this::getProjetByEtudiant)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    // Changer le statut d'un projet
    public Projet changerStatutProjet(Long projetId, String statut) {
        Projet projet = projetRepository.findById(projetId).orElseThrow();
        projet.setStatut(statut);
        return projetRepository.save(projet);
    }

    public void deleteProjetByEtudiant(User etudiant) {
        List<Projet> projets = projetRepository.findAll().stream()
            .filter(p -> p.getEtudiants() != null && p.getEtudiants().stream().anyMatch(e -> e.getId().equals(etudiant.getId())))
            .toList();
        for (Projet p : projets) {
            p.getEtudiants().clear(); // Supprime la jointure ManyToMany
            projetRepository.save(p); // Met à jour la jointure
            projetRepository.delete(p); // Supprime le projet
        }
    }
} 