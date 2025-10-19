package com.ahsumon.SalaryManagementSystem.service;

import com.ahsumon.SalaryManagementSystem.dto.GradeDTO;
import com.ahsumon.SalaryManagementSystem.entity.Grade;
import com.ahsumon.SalaryManagementSystem.exception.ResourceNotFoundException;
import com.ahsumon.SalaryManagementSystem.repository.GradeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    public GradeDTO createGrade(GradeDTO dto) {
        Grade grade = Grade.builder()
                .gradeId(dto.getGradeId())
                .gradeLevel(dto.getGradeLevel())
                .baseSalary(dto.getBaseSalary())
                .description(dto.getDescription())
                .build();

        Grade saved = gradeRepository.save(grade);
        return mapToDTO(saved);
    }

    public GradeDTO updateGrade(Integer gradeId, GradeDTO dto) {
        Grade grade = gradeRepository.findByGradeId(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));

        grade.setGradeLevel(dto.getGradeLevel());
        grade.setBaseSalary(dto.getBaseSalary());
        grade.setDescription(dto.getDescription());

        return mapToDTO(gradeRepository.save(grade));
    }

    public void deleteGrade(Integer gradeId) {
        Grade grade = gradeRepository.findByGradeId(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));
        gradeRepository.delete(grade);
    }

    public GradeDTO getGrade(Integer gradeId) {
        return mapToDTO(gradeRepository.findByGradeId(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found")));
    }

    public List<GradeDTO> getAllGrades() {
        return gradeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private GradeDTO mapToDTO(Grade grade) {
        return GradeDTO.builder()
                .gradeId(grade.getGradeId())
                .gradeLevel(grade.getGradeLevel())
                .baseSalary(grade.getBaseSalary())
                .description(grade.getDescription())
                .build();
    }
}
