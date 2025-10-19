package com.ahsumon.SalaryManagementSystem.service;

import com.ahsumon.SalaryManagementSystem.dto.SalaryBreakdown;
import com.ahsumon.SalaryManagementSystem.dto.SalaryDTO;
import com.ahsumon.SalaryManagementSystem.dto.SalarySheetDTO;
import com.ahsumon.SalaryManagementSystem.entity.*;
import com.ahsumon.SalaryManagementSystem.enums.TransactionStatus;
import com.ahsumon.SalaryManagementSystem.exception.InvalidInputException;
import com.ahsumon.SalaryManagementSystem.exception.ResourceNotFoundException;
import com.ahsumon.SalaryManagementSystem.repository.CompanyBankAccountRepository;
import com.ahsumon.SalaryManagementSystem.repository.EmployeeRepository;
import com.ahsumon.SalaryManagementSystem.repository.SalaryTransactionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SalaryTransferService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CompanyBankAccountRepository companyBankRepository;

    @Autowired
    private SalaryTransactionRepository transactionRepository;

    @Autowired
    private SalaryCalculationService calculationService;

    @Transactional
    public SalarySheetDTO processSalaryTransfer(Long companyAccountId) {
        CompanyBankAccount companyAccount = companyBankRepository.findById(companyAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Company account not found"));

        List<Employee> employees = employeeRepository.findAll();
        BigDecimal totalPaidSalary = BigDecimal.ZERO;
        BigDecimal balanceBefore = companyAccount.getBalance();
        List<SalaryTransaction> transactions = new ArrayList<>();
        int successCount = 0;
        int failCount = 0;

        for (Employee employee : employees) {
            SalaryBreakdown breakdown = calculationService.calculateSalary(employee);

            // Check funds
            if (companyAccount.getBalance().compareTo(breakdown.getTotalSalary()) >= 0) {
                // Deduct from company account
                companyAccount.setBalance(companyAccount.getBalance().subtract(breakdown.getTotalSalary()));

                // Add to employee account
                BankAccount empAccount = employee.getBankAccount();
                empAccount.setCurrentBalance(empAccount.getCurrentBalance().add(breakdown.getTotalSalary()));

                // Create transaction record
                SalaryTransaction transaction = SalaryTransaction.builder()
                        .employee(employee)
                        .basicSalary(breakdown.getBasicSalary())
                        .houseRent(breakdown.getHouseRent())
                        .medicalAllowance(breakdown.getMedicalAllowance())
                        .totalSalary(breakdown.getTotalSalary())
                        .transactionDate(LocalDate.now())
                        .status(TransactionStatus.SUCCESS)
                        .build();

                transactions.add(transaction);
                totalPaidSalary = totalPaidSalary.add(breakdown.getTotalSalary());
                successCount++;
            } else {
                // Insufficient funds
                SalaryTransaction transaction = SalaryTransaction.builder()
                        .employee(employee)
                        .basicSalary(breakdown.getBasicSalary())
                        .houseRent(breakdown.getHouseRent())
                        .medicalAllowance(breakdown.getMedicalAllowance())
                        .totalSalary(breakdown.getTotalSalary())
                        .transactionDate(LocalDate.now())
                        .status(TransactionStatus.FAILED)
                        .remarks("Insufficient company funds")
                        .build();

                transactions.add(transaction);
                failCount++;
            }
        }
        // Save all transactions and update company account
        transactionRepository.saveAll(transactions);
        companyAccount.setLastUpdated(LocalDateTime.now());
        companyBankRepository.save(companyAccount);

        // Create salary sheet
        SalarySheet salarySheet = SalarySheet.builder()
                .generatedDate(LocalDate.now())
                .totalPaidSalary(totalPaidSalary)
                .companyBalanceBefore(balanceBefore)
                .companyBalanceAfter(companyAccount.getBalance())
                .transactionCount(transactions.size())
                .successfulCount(successCount)
                .failedCount(failCount)
                .build();

        // Return DTO with all details
        return buildSalarySheetDTO(salarySheet, transactions);
    }

    @Transactional
    public void addFundsToCompanyAccount(Long accountId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Amount must be greater than zero");
        }

        CompanyBankAccount account = companyBankRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Company account not found"));

        account.setBalance(account.getBalance().add(amount));
        account.setLastUpdated(LocalDateTime.now());
        companyBankRepository.save(account);

        log.info("Added {} to company account. New balance: {}", amount, account.getBalance());
    }

    private SalarySheetDTO buildSalarySheetDTO(SalarySheet salarySheet, List<SalaryTransaction> transactions) {
        List<SalaryDTO> salaryDTOs = transactions.stream()
                .map(this::mapTransactionToSalaryDTO)
                .collect(Collectors.toList());

        return SalarySheetDTO.builder()
                .salaryDetails(salaryDTOs)
                .totalPaidSalary(salarySheet.getTotalPaidSalary())
                .companyBalanceBefore(salarySheet.getCompanyBalanceBefore())
                .companyBalanceAfter(salarySheet.getCompanyBalanceAfter())
                .generatedDate(salarySheet.getGeneratedDate())
                .totalEmployees(salarySheet.getTransactionCount())
                .build();
    }

    private SalaryDTO mapTransactionToSalaryDTO(SalaryTransaction transaction) {
        return SalaryDTO.builder()
                .employeeId(transaction.getEmployee().getId().toString())
                .employeeName(transaction.getEmployee().getName())
                .grade(transaction.getEmployee().getGrade().getGradeLevel())
                .basicSalary(transaction.getBasicSalary())
                .houseRent(transaction.getHouseRent())
                .medicalAllowance(transaction.getMedicalAllowance())
                .totalSalary(transaction.getTotalSalary())
                .paymentDate(transaction.getTransactionDate())
                .status(transaction.getStatus().toString())
                .build();
    }
}
