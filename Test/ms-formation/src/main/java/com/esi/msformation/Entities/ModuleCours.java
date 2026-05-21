package com.esi.msformation.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleCours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private int volumeHoraire;


    @ManyToOne(fetch = FetchType.EAGER)
    private Enseignant enseignant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Formation formation;
}
