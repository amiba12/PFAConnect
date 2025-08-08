package org.example.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Projet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    private String technologies;
    private Date dateDebut;
    private Date dateFin;
    private String organisme;
    private String statut; // EN_COURS, TERMINE

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private java.util.List<User> etudiants;

    @ManyToOne
    private Groupe groupe;

    private String rapport; // chemin du fichier PDF
    private String lienGitHub;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private java.util.List<Message> messages;
} 