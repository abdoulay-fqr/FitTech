package com.esi.msformation.Repository;

import com.esi.msformation.Entities.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnseignantRepository extends JpaRepository<Enseignant , Long> {
}
