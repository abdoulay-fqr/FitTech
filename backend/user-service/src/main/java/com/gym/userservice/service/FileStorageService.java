package com.gym.userservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png"
    );
    private static final long MAX_SIZE = 2 * 1024 * 1024; // 2MB

    // ── Save file ──────────────────────────────────────────────────
    public String saveFile(MultipartFile file, String type, String userId) throws IOException {

        // ──► Validate file type
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Invalid file type. Only jpg and png are allowed.");
        }

        // ──► Validate file size
        if (file.getSize() > MAX_SIZE) {
            throw new RuntimeException("File size exceeds 2MB limit.");
        }

        // ──► Create directory if not exists
        Path dirPath = Paths.get(uploadDir, type);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        // ──► Save file as {userId}.jpg
        String filename = userId + ".jpg";
        Path filePath = dirPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return type + "/" + filename;
    }

    // ── Delete file ────────────────────────────────────────────────
    public void deleteFile(String type, String userId) {
        try {
            Path filePath = Paths.get(uploadDir, type, userId + ".jpg");
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // silently ignore if file doesn't exist
        }
    }

    // ── Get file path ──────────────────────────────────────────────
    public Path getFilePath(String type, String userId) {
        return Paths.get(uploadDir, type, userId + ".jpg");
    }

    // ── File exists ────────────────────────────────────────────────
    public boolean fileExists(String type, String userId) {
        Path filePath = Paths.get(uploadDir, type, userId + ".jpg");
        return Files.exists(filePath);
    }
}