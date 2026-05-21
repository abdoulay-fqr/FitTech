package com.esi.msuniversite.DTO;

import lombok.Data;

import java.util.List;

@Data
public class FormationDTO {
    private String intitule;
    private List<ModuleDTO> modules;
}