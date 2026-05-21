package com.esi.msuniversite.Controller;

import com.esi.msuniversite.DTO.FormationDTO;
import com.esi.msuniversite.Entities.Faculte;
import com.esi.msuniversite.Repository.FaculteRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.graphql.client.HttpGraphQlClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class FaculteAPI {

    final FaculteRepository faculteRepository;
    final HttpGraphQlClient formationClient;

    public FaculteAPI(
            FaculteRepository faculteRepository,
            @Qualifier("formationGraphQlClient") HttpGraphQlClient formationClient
    ) {
        this.faculteRepository = faculteRepository;
        this.formationClient = formationClient;
    }

    @GetMapping("/faculte/{id}")
    public Faculte getFaculteWithDetails(@PathVariable("id") Long idFaculte) {


        Faculte faculte = faculteRepository.findById(idFaculte)
                .orElseThrow(() -> new RuntimeException("Faculté non trouvée"));



        String query = "{ formationsByFaculte(facId: " + idFaculte + ") " +
                "{ intitule " +
                "  modules { titre enseignant { nom } } " +
                "} }";


        List<FormationDTO> formations = formationClient.document(query)
                .retrieve("formationsByFaculte")
                .toEntityList(FormationDTO.class)
                .block();


        faculte.setFormations(formations);

        return faculte;
    }

    @GetMapping("/hello")
    public String hello() {
        return "OK";
    }
}