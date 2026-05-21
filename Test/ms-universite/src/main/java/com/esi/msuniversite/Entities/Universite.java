package com.esi.msuniversite.Entities;

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
public class Universite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String ville;


    private Long recteurId;

    @OneToMany(mappedBy = "universite", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("universite")
    private List<Faculte> facultes = new ArrayList<>();
}