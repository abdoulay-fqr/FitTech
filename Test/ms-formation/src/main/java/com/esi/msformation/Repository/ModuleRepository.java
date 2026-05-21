package com.esi.msformation.Repository;

import com.esi.msformation.Entities.ModuleCours;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<ModuleCours, Long> {
}
