package org.example.repositories;

import org.example.entities.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupeRepository extends JpaRepository<Groupe, Long> {
    java.util.List<Groupe> findByEncadrant_Id(Long encadrantId);
} 