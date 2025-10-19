package com.ahsumon.SalaryManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalarySheetDTO {
    private List<SalaryDTO> salaryDetails;
    private BigDecimal totalPaidSalary;
    private BigDecimal companyBalanceBefore;
    private BigDecimal companyBalanceAfter;
    private LocalDate generatedDate;
    private Integer totalEmployees;
    private Integer transactionCount;
    private Integer successfulCount;
    private Integer failedCount;
}
