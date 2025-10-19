package com.ahsumon.SalaryManagementSystem.repository;

import com.ahsumon.SalaryManagementSystem.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findByGradeId(Integer gradeId);
    boolean existsByGradeId(Integer gradeId);
}
