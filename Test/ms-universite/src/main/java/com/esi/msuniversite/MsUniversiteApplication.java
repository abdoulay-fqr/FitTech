package com.esi.msuniversite;

import com.esi.msuniversite.Entities.Faculte;
import com.esi.msuniversite.Entities.Universite;
import com.esi.msuniversite.Repository.FaculteRepository;
import com.esi.msuniversite.Repository.UniversiteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MsUniversiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsUniversiteApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(UniversiteRepository universiteRepo,
                               FaculteRepository faculteRepo) {
        return args -> {


            Universite univ = new Universite();
            univ.setNom("Université Oran ");
            univ.setVille("Oran");
            univ.setRecteurId(1L);
            univ = universiteRepo.save(univ);


            Faculte faculteInfo = new Faculte();
            faculteInfo.setNom("Faculté 1 Informatique");
            faculteInfo.setDomaine("Informatique");
            faculteInfo.setDoyenId(2L);
            faculteInfo.setUniversite(univ);
            faculteRepo.save(faculteInfo);

            Faculte faculteMed = new Faculte();
            faculteMed.setNom("Faculté 2");
            faculteMed.setDoyenId(3L);
            faculteMed.setUniversite(univ);
            faculteRepo.save(faculteMed);

            System.out.println("======================================");
            System.out.println("Ms-Universite : données initialisées");
            System.out.println("Universités créées : " + universiteRepo.count());
            System.out.println("Facultés créées    : " + faculteRepo.count());
            System.out.println("======================================");
            System.out.println("Test : GET http://localhost:8081/universite/1/details");
            System.out.println("Via Gateway : GET http://localhost:7777/cloud/universite/universite/1/details");
        };
    }
}
