package org.example.services;

import org.example.entities.Message;
import org.example.entities.Projet;
import org.example.entities.User;
import org.example.repositories.MessageRepository;
import org.example.repositories.ProjetRepository;
import org.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ProjetRepository projetRepository;
    @Autowired
    private UserRepository userRepository;

    public Message save(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    public Optional<Message> findById(Long id) {
        return messageRepository.findById(id);
    }

    // Ajouter un message à un projet
    @Transactional
    public Message ajouterMessage(Long projetId, Long auteurId, String contenu) {
        // Vérifier que le projet existe
        Projet projet = projetRepository.findById(projetId)
            .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + projetId));
        
        // Vérifier que l'auteur existe
        User auteur = userRepository.findById(auteurId)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + auteurId));
        
        // Créer le message
        Message message = new Message();
        message.setProjet(projet);
        message.setAuteur(auteur);
        message.setContenu(contenu);
        message.setDate(new Date());
        
        // Sauvegarder le message
        Message savedMessage = messageRepository.save(message);
        
        // Vérifier que le projet existe toujours après l'ajout du message
        if (!projetRepository.existsById(projetId)) {
            throw new RuntimeException("Le projet a été supprimé lors de l'ajout du message");
        }
        
        return savedMessage;
    }

    // Récupérer les messages d'un projet
    public List<Message> getMessagesByProjet(Long projetId) {
        return messageRepository.findAll().stream()
                .filter(m -> m.getProjet() != null && m.getProjet().getId().equals(projetId))
                .sorted((m1, m2) -> m1.getDate().compareTo(m2.getDate()))
                .collect(Collectors.toList());
    }
} 