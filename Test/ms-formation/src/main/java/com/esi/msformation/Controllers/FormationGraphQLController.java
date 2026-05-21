package com.esi.msformation.Controllers;

import com.esi.msformation.Entities.Formation;
import com.esi.msformation.Repository.FormationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;


@Controller
public class FormationGraphQLController {
    @Autowired
    private FormationRepository formationRepo;

    @QueryMapping
    public List<Formation> formationsByFaculte(@Argument Long facId) {
        return formationRepo.findByFaculteId(facId);
    }
}
