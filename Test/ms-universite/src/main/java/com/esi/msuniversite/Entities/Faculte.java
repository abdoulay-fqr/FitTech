package com.esi.msuniversite.Entities;

import com.esi.msuniversite.DTO.FormationDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Faculte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String domaine;


    private Long doyenId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Universite universite;

    @Transient
    private List<FormationDTO> formations;
}
