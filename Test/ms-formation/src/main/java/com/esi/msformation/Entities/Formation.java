package com.esi.msformation.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String intitule;

    @Enumerated(EnumType.STRING)
    private Niveau niveau;

    private Long faculteId;


    @ManyToOne(fetch = FetchType.EAGER)
    private Enseignant responsable;

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("formation")
    private List<ModuleCours> modules = new ArrayList<>();
}