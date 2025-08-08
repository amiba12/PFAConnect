package org.example.repositories;

import org.example.entities.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RapportRepository extends JpaRepository<Rapport, Long> {
} 