package com.ahsumon.SalaryManagementSystem.repository;

import com.ahsumon.SalaryManagementSystem.entity.SalarySheet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalarySheetRepository extends JpaRepository<SalarySheet, Long> {
    // You can add query methods later if needed
}
