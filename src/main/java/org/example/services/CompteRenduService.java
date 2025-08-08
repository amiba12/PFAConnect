package org.example.services;

import org.example.entities.CompteRendu;
import org.example.entities.Projet;
import org.example.entities.User;
import org.example.repositories.CompteRenduRepository;
import org.example.repositories.ProjetRepository;
import org.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompteRenduService {
    @Autowired
    private CompteRenduRepository compteRenduRepository;
    @Autowired
    private ProjetRepository projetRepository;
    @Autowired
    private UserRepository userRepository;

    public CompteRendu save(CompteRendu compteRendu) {
        return compteRenduRepository.save(compteRendu);
    }

    public List<CompteRendu> findAll() {
        return compteRenduRepository.findAll();
    }

    public Optional<CompteRendu> findById(Long id) {
        return compteRenduRepository.findById(id);
    }

    // Lister les comptes-rendus d'un projet
    public List<CompteRendu> getCompteRendusByProjet(Long projetId) {
        return compteRenduRepository.findAll().stream()
                .filter(cr -> cr.getProjet() != null && cr.getProjet().getId().equals(projetId))
                .collect(Collectors.toList());
    }

    // Ajouter un compte-rendu à un projet par un encadrant
    public CompteRendu ajouterCompteRendu(Long projetId, Long encadrantId, String contenu) {
        Projet projet = projetRepository.findById(projetId).orElseThrow();
        User encadrant = userRepository.findById(encadrantId).orElseThrow();
        CompteRendu cr = new CompteRendu();
        cr.setProjet(projet);
        cr.setEncadrant(encadrant);
        cr.setContenu(contenu);
        cr.setDate(new java.util.Date());
        return compteRenduRepository.save(cr);
    }
} 