package com.ahsumon.SalaryManagementSystem.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeDTO {

    @NotNull(message = "Grade ID is required")
    private Integer gradeId;  // 1-6

    @NotBlank(message = "Grade level is required")
    private String gradeLevel;

    @NotNull(message = "Base salary is required")
    private BigDecimal baseSalary;

    private String description;
}
