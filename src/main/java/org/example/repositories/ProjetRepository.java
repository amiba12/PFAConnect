package org.example.repositories;

import org.example.entities.Projet;
import org.example.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjetRepository extends JpaRepository<Projet, Long> {
    
    @Query("SELECT p FROM Projet p JOIN p.etudiants e WHERE e.id = :etudiantId")
    Optional<Projet> findByEtudiantId(@Param("etudiantId") Long etudiantId);
    
    @Query("SELECT p FROM Projet p JOIN p.etudiants e WHERE e.id = :etudiantId")
    List<Projet> findAllByEtudiantId(@Param("etudiantId") Long etudiantId);
    
    @Query("SELECT p FROM Projet p WHERE p.etudiants IS NOT EMPTY")
    List<Projet> findAllWithEtudiants();
} 