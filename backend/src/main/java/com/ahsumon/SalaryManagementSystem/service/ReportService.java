package com.ahsumon.SalaryManagementSystem.service;

import com.ahsumon.SalaryManagementSystem.dto.SalaryBreakdown;
import com.ahsumon.SalaryManagementSystem.dto.SalarySheetDTO;
import com.ahsumon.SalaryManagementSystem.entity.CompanyBankAccount;
import com.ahsumon.SalaryManagementSystem.entity.Employee;
import com.ahsumon.SalaryManagementSystem.entity.SalarySheet;
import com.ahsumon.SalaryManagementSystem.exception.ResourceNotFoundException;
import com.ahsumon.SalaryManagementSystem.repository.CompanyBankAccountRepository;
import com.ahsumon.SalaryManagementSystem.repository.EmployeeRepository;
import com.ahsumon.SalaryManagementSystem.repository.SalarySheetRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ReportService {

    @Autowired
    private SalarySheetRepository salarySheetRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CompanyBankAccountRepository companyBankRepository;

    @Autowired
    private SalaryCalculationService salaryCalculationService;

    /**
     * Requirement 7: Get employee salary sheet with name, rank, and salary
     */
    public Map<String, Object> getEmployeeSalarySheet() {
        log.info("Generating employee salary sheet (Requirement 7)");

        List<Employee> employees = employeeRepository.findAll();
        List<Map<String, Object>> employeeList = new ArrayList<>();
        BigDecimal totalSalary = BigDecimal.ZERO;

        for (Employee employee : employees) {
            SalaryBreakdown breakdown = salaryCalculationService.calculateSalary(employee);

            Map<String, Object> employeeDetail = new HashMap<>();
            employeeDetail.put("employeeId", employee.getEmployeeId());
            employeeDetail.put("name", employee.getName());
            employeeDetail.put("rank", employee.getGrade().getGradeLevel());
            employeeDetail.put("salary", breakdown.getTotalSalary());

            employeeList.add(employeeDetail);
            totalSalary = totalSalary.add(breakdown.getTotalSalary());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("employeeCount", employees.size());
        response.put("employees", employeeList);
        response.put("totalPayroll", totalSalary);

        log.info("Employee salary sheet generated for {} employees", employees.size());
        return response;
    }

    /**
     * Requirement 8: Get company account summary with total paid salary and remaining balance
     */
    public Map<String, Object> getCompanyAccountSummary(String accountNumber) {
        log.info("Generating company account summary for account: {}", accountNumber);

        CompanyBankAccount account = companyBankRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Company account not found"));

        // Calculate total paid salary
        List<Employee> employees = employeeRepository.findAll();
        BigDecimal totalPaidSalary = employees.stream()
                .map(salaryCalculationService::calculateSalary)
                .map(SalaryBreakdown::getTotalSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("accountNumber", account.getAccountNumber());
        response.put("totalPaidSalary", totalPaidSalary);
        response.put("remainingBalance", account.getBalance());
        response.put("totalEmployees", employees.size());

        log.info("Company account summary - Total paid: {}, Remaining: {}", totalPaidSalary, account.getBalance());
        return response;
    }


    /**
     * Get all salary sheets
     */
    public List<SalarySheetDTO> getAllSalarySheets() {
        log.info("Fetching all salary sheets");
        return salarySheetRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get specific salary sheet by ID
     */
    public SalarySheetDTO getSalarySheet(Long sheetId) {
        log.info("Fetching salary sheet with ID: {}", sheetId);
        SalarySheet sheet = salarySheetRepository.findById(sheetId)
                .orElseThrow(() -> new ResourceNotFoundException("Salary sheet not found"));
        return mapToDTO(sheet);
    }

    /**
     * Map SalarySheet entity to DTO
     */
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
    @Transactional
    public SalarySheetDTO generateSalarySheet() {
        log.info("Generating new salary sheet...");

        // 1️⃣ Fetch all employees and calculate total salary
        List<Employee> employees = employeeRepository.findAll();
        BigDecimal totalPaidSalary = employees.stream()
                .map(salaryCalculationService::calculateSalary)
                .map(SalaryBreakdown::getTotalSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2️⃣ Get company account
        CompanyBankAccount account = companyBankRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Company account not found"));

        BigDecimal balanceBefore = account.getBalance();
        BigDecimal balanceAfter = balanceBefore.subtract(totalPaidSalary);

        // 3️⃣ Update account balance
        account.setBalance(balanceAfter);
        companyBankRepository.save(account);

        // 4️⃣ Create SalarySheet entity
        SalarySheet sheet = new SalarySheet();
        sheet.setGeneratedDate(LocalDate.now());
        sheet.setTotalPaidSalary(totalPaidSalary);
        sheet.setCompanyBalanceBefore(balanceBefore);
        sheet.setCompanyBalanceAfter(balanceAfter);
        sheet.setTransactionCount(employees.size());
        sheet.setSuccessfulCount(employees.size());
        sheet.setFailedCount(0);

        salarySheetRepository.save(sheet);

        log.info("Salary sheet saved successfully: {}", sheet.getId());
        return mapToDTO(sheet);
    }

}
