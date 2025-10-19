package com.ahsumon.SalaryManagementSystem.service;

import com.ahsumon.SalaryManagementSystem.dto.SalaryBreakdown;
import com.ahsumon.SalaryManagementSystem.entity.Employee;
import com.ahsumon.SalaryManagementSystem.entity.Grade;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
public class SalaryCalculationService {

    private static final BigDecimal HOUSE_RENT_PERCENTAGE = new BigDecimal("0.20");
    private static final BigDecimal MEDICAL_ALLOWANCE_PERCENTAGE = new BigDecimal("0.15");

    public SalaryBreakdown calculateSalary(Employee employee) {
        Grade grade = employee.getGrade();
        BigDecimal basicSalary = grade.getBaseSalary();

        BigDecimal houseRent = basicSalary.multiply(HOUSE_RENT_PERCENTAGE);
        BigDecimal medicalAllowance = basicSalary.multiply(MEDICAL_ALLOWANCE_PERCENTAGE);
        BigDecimal totalSalary = basicSalary.add(houseRent).add(medicalAllowance);

        return SalaryBreakdown.builder()
                .basicSalary(basicSalary)
                .houseRent(houseRent)
                .medicalAllowance(medicalAllowance)
                .totalSalary(totalSalary)
                .build();
    }
}
