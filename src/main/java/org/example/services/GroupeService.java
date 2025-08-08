package org.example.services;

import org.example.entities.Groupe;
import org.example.entities.User;
import org.example.repositories.GroupeRepository;
import org.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupeService {
    @Autowired
    private GroupeRepository groupeRepository;
    @Autowired
    private UserRepository userRepository;

    public Groupe save(Groupe groupe) {
        return groupeRepository.save(groupe);
    }

    public List<Groupe> findAll() {
        return groupeRepository.findAll();
    }

    public Optional<Groupe> findById(Long id) {
        return groupeRepository.findById(id);
    }

    // Ajouter un étudiant à un groupe
    public Groupe ajouterEtudiant(Long groupeId, Long etudiantId) {
        Groupe groupe = groupeRepository.findById(groupeId).orElseThrow();
        User etudiant = userRepository.findById(etudiantId).orElseThrow();
        groupe.getEtudiants().add(etudiant);
        return groupeRepository.save(groupe);
    }

    // Retirer un étudiant d'un groupe
    public Groupe retirerEtudiant(Long groupeId, Long etudiantId) {
        Groupe groupe = groupeRepository.findById(groupeId).orElseThrow();
        User etudiant = userRepository.findById(etudiantId).orElseThrow();
        groupe.getEtudiants().remove(etudiant);
        return groupeRepository.save(groupe);
    }

    // Associer un encadrant à un groupe
    public Groupe associerEncadrant(Long groupeId, Long encadrantId) {
        Groupe groupe = groupeRepository.findById(groupeId).orElseThrow();
        User encadrant = userRepository.findById(encadrantId).orElseThrow();
        groupe.setEncadrant(encadrant);
        return groupeRepository.save(groupe);
    }

    // Récupérer les étudiants d'un groupe
    public List<User> getEtudiantsDuGroupe(Long groupeId) {
        Groupe groupe = groupeRepository.findById(groupeId).orElseThrow();
        return groupe.getEtudiants();
    }

    // Récupérer l'encadrant d'un groupe
    public User getEncadrantDuGroupe(Long groupeId) {
        Groupe groupe = groupeRepository.findById(groupeId).orElseThrow();
        return groupe.getEncadrant();
    }

    public List<Groupe> findByEncadrantId(Long encadrantId) {
        return groupeRepository.findByEncadrant_Id(encadrantId);
    }
} 