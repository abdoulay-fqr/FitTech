package com.gym.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NfcRequest {

    @NotBlank(message = "NFC card ID is required")
    private String nfcCardId;
}