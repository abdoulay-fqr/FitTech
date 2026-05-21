package com.esi.msformation.Repository;

import com.esi.msformation.Entities.Formation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {

    List<Formation> findByFaculteId(Long faculteId);
}
