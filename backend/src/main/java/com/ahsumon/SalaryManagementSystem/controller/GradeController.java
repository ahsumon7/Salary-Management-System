package com.ahsumon.SalaryManagementSystem.controller;


import com.ahsumon.SalaryManagementSystem.dto.GradeDTO;
import com.ahsumon.SalaryManagementSystem.dto.ApiResponse;
import com.ahsumon.SalaryManagementSystem.service.GradeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/grades")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @PostMapping
    public ResponseEntity<ApiResponse<GradeDTO>> createGrade(
            @Valid @RequestBody GradeDTO dto) {
        log.info("Creating new grade: {}", dto.getGradeLevel());
        try {
            GradeDTO created = gradeService.createGrade(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Grade created successfully", created, true));
        } catch (Exception e) {
            log.error("Error creating grade: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Failed to create grade", null, false));
        }
    }

    @GetMapping("/{gradeId}")
    public ResponseEntity<ApiResponse<GradeDTO>> getGrade(@PathVariable Integer gradeId) {
        log.info("Fetching grade: {}", gradeId);
        try {
            GradeDTO grade = gradeService.getGrade(gradeId);
            return ResponseEntity.ok(new ApiResponse<>("Grade retrieved successfully", grade, true));
        } catch (Exception e) {
            log.error("Error fetching grade: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Grade not found", null, false));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GradeDTO>>> getAllGrades() {
        log.info("Fetching all grades");
        try {
            List<GradeDTO> grades = gradeService.getAllGrades();
            return ResponseEntity.ok(new ApiResponse<>("All grades retrieved", grades, true));
        } catch (Exception e) {
            log.error("Error fetching grades: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to fetch grades", null, false));
        }
    }

    @PutMapping("/{gradeId}")
    public ResponseEntity<ApiResponse<GradeDTO>> updateGrade(
            @PathVariable Integer gradeId,
            @Valid @RequestBody GradeDTO dto) {
        log.info("Updating grade: {}", gradeId);
        try {
            GradeDTO updated = gradeService.updateGrade(gradeId, dto);
            return ResponseEntity.ok(new ApiResponse<>("Grade updated successfully", updated, true));
        } catch (Exception e) {
            log.error("Error updating grade: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Grade not found", null, false));
        }
    }

    @DeleteMapping("/{gradeId}")
    public ResponseEntity<ApiResponse<?>> deleteGrade(@PathVariable Integer gradeId) {
        log.info("Deleting grade: {}", gradeId);
        try {
            gradeService.deleteGrade(gradeId);
            return ResponseEntity.ok(new ApiResponse<>("Grade deleted successfully", null, true));
        } catch (Exception e) {
            log.error("Error deleting grade: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Grade not found", null, false));
        }
    }
}
