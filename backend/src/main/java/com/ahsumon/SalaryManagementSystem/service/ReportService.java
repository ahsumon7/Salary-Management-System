package com.ahsumon.SalaryManagementSystem.service;


import com.ahsumon.SalaryManagementSystem.dto.SalarySheetDTO;
import com.ahsumon.SalaryManagementSystem.entity.SalarySheet;
import com.ahsumon.SalaryManagementSystem.repository.SalarySheetRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ReportService {

    @Autowired
    private SalarySheetRepository salarySheetRepository;

    public List<SalarySheetDTO> getAllSalarySheets() {
        return salarySheetRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SalarySheetDTO getSalarySheet(Long sheetId) {
        SalarySheet sheet = salarySheetRepository.findById(sheetId)
                .orElseThrow(() -> new ResourceNotFoundException("Salary sheet not found"));
        return mapToDTO(sheet);
    }

    private SalarySheetDTO mapToDTO(SalarySheet sheet) {
        return SalarySheetDTO.builder()
                .generatedDate(sheet.getGeneratedDate())
                .totalPaidSalary(sheet.getTotalPaidSalary())
                .companyBalanceBefore(sheet.getCompanyBalanceBefore())
                .companyBalanceAfter(sheet.getCompanyBalanceAfter())
                .transactionCount(sheet.getTransactionCount())
                .successfulCount(sheet.getSuccessfulCount())
                .failedCount(sheet.getFailedCount())
                .build();
    }
}
