package com.esi.msformation;

import com.esi.msformation.Entities.*;
import com.esi.msformation.Entities.ModuleCours;
import com.esi.msformation.Repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

/**
 * Point d'entrée de Ms-Formation.
 *
 * Bounded Context : Formation, Enseignant, Module
 * Port : 8082
 * Base de données : H2 en mémoire (formation-db)
 */
@SpringBootApplication
@EnableDiscoveryClient
public class MsFormationApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsFormationApplication.class, args);
    }

    /**
     * Initialise des données de test au démarrage.
     * Crée des Enseignants, Formations et Modules.
     *
     * IMPORTANT : les faculteId (1L, 2L) correspondent aux IDs
     * des Facultés créées dans Ms-Universite.
     */
    @Bean
    CommandLineRunner initData(EnseignantRepository enseignantRepo,
                               FormationRepository formationRepo,
                               ModuleRepository moduleRepo) {
        return args -> {

            // =============================================
            // ENSEIGNANTS
            // =============================================
            // ID=1 → sera le Recteur de l'université (recteurId=1 dans Ms-Universite)
            Enseignant recteur = enseignantRepo.save(
                    new Enseignant(null, "Prof. Benali Ahmed", "benali@univ-oran.dz", Grade.PROFESSEUR)
            );

            // ID=2 → sera le Doyen de la Faculté Informatique (doyenId=2)
            Enseignant doyenInfo = enseignantRepo.save(
                    new Enseignant(null, "Dr. Meziane Sara", "meziane@univ-oran.dz", Grade.MCA)
            );

            // ID=3 → sera le Doyen de la Faculté Médecine (doyenId=3)
            Enseignant doyenMed = enseignantRepo.save(
                    new Enseignant(null, "Prof. Khelif Karim", "khelif@univ-oran.dz", Grade.PROFESSEUR)
            );

            // ID=4 → Enseignant normal
            Enseignant ens4 = enseignantRepo.save(
                    new Enseignant(null, "Dr. Hadj Fatima", "hadj@univ-oran.dz", Grade.MCB)
            );

            // ID=5 → Enseignant normal
            Enseignant ens5 = enseignantRepo.save(
                    new Enseignant(null, "Dr. Tlemceni Omar", "tlemceni@univ-oran.dz", Grade.MCA)
            );

            // =============================================
            // FORMATIONS (liées à la Faculté Informatique : faculteId=1)
            // =============================================
            Formation licenceInfo = formationRepo.save(
                    new Formation(null, "Licence Informatique", Niveau.LICENCE,
                            1L,          // faculteId=1 (Faculté Informatique dans Ms-Universite)
                            doyenInfo,   // Enseignant responsable
                            null)
            );

            Formation masterIA = formationRepo.save(
                    new Formation(null, "Master Intelligence Artificielle", Niveau.MASTER,
                            1L,
                            recteur,
                            null)
            );

            // Formation liée à la Faculté Médecine : faculteId=2
            Formation licenceMed = formationRepo.save(
                    new Formation(null, "Licence Médecine Générale", Niveau.LICENCE,
                            2L,          // faculteId=2 (Faculté Médecine dans Ms-Universite)
                            doyenMed,
                            null)
            );

            // =============================================
            // MODULES (liés aux formations)
            // =============================================

            // Modules de Licence Informatique
            moduleRepo.save(new ModuleCours(null, "Algorithmique et Structures de Données",
                    45, doyenInfo, licenceInfo));

            moduleRepo.save(new ModuleCours(null, "Base de Données Relationnelles",
                    40, ens4, licenceInfo));

            moduleRepo.save(new ModuleCours(null, "Programmation Orientée Objet",
                    45, ens5, licenceInfo));

            moduleRepo.save(new ModuleCours(null, "Réseaux Informatiques",
                    35, ens4, licenceInfo));

            // Modules de Master IA
            moduleRepo.save(new ModuleCours(null, "Machine Learning",
                    50, recteur, masterIA));

            moduleRepo.save(new ModuleCours(null, "Deep Learning et Réseaux de Neurones",
                    50, ens5, masterIA));

            moduleRepo.save(new ModuleCours(null, "Traitement du Langage Naturel",
                    40, doyenInfo, masterIA));

            // Modules de Licence Médecine
            moduleRepo.save(new ModuleCours(null, "Anatomie Générale",
                    60, doyenMed, licenceMed));

            moduleRepo.save(new ModuleCours(null, "Biochimie Médicale",
                    50, ens4, licenceMed));

            System.out.println("====================================");
            System.out.println("Ms-Formation : données initialisées");
            System.out.println("Enseignants créés : " + enseignantRepo.count());
            System.out.println("Formations créées : " + formationRepo.count());
            System.out.println("Modules créés     : " + moduleRepo.count());
            System.out.println("====================================");
        };
    }
}
