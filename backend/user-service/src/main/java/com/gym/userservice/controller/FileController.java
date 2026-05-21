package com.gym.userservice.controller;

import com.gym.userservice.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;

@RestController
@RequestMapping("/users/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    // ── Serve profile picture ──────────────────────────────────────
    @GetMapping("/{type}/{userId}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String type,
            @PathVariable String userId) {
        try {
            Path filePath = fileStorageService.getFilePath(type, userId);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}