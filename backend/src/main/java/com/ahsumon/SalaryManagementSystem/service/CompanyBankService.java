package com.ahsumon.SalaryManagementSystem.service;

import com.ahsumon.SalaryManagementSystem.dto.CompanyBankAccountDTO;
import com.ahsumon.SalaryManagementSystem.entity.CompanyBankAccount;
import com.ahsumon.SalaryManagementSystem.exception.InvalidInputException;
import com.ahsumon.SalaryManagementSystem.exception.ResourceNotFoundException;
import com.ahsumon.SalaryManagementSystem.repository.CompanyBankAccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CompanyBankService {

    @Autowired
    private CompanyBankAccountRepository companyBankRepository;

    // Create new company account
    public CompanyBankAccountDTO createCompanyAccount(CompanyBankAccountDTO dto) {
        // Optional: check if account number already exists
        if (companyBankRepository.existsByAccountNumber(dto.getAccountNumber())) {
            throw new InvalidInputException("Account number already exists");
        }

        CompanyBankAccount account = CompanyBankAccount.builder()
                .accountNumber(dto.getAccountNumber())
                .accountName(dto.getAccountName())
                .bankName(dto.getBankName())
                .branchName(dto.getBranchName())
                .balance(dto.getBalance())
                .build();

        CompanyBankAccount saved = companyBankRepository.save(account);
        return mapToDTO(saved);
    }

    // Get account by ID
    public CompanyBankAccountDTO getCompanyAccount(Long accountId) {
        CompanyBankAccount account = companyBankRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Company account not found"));
        return mapToDTO(account);
    }

    // Get all company accounts
    public List<CompanyBankAccountDTO> getAllCompanyAccounts() {
        return companyBankRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    public CompanyBankAccountDTO getCompanyAccountByNumber(String accountNumber) {
        CompanyBankAccount account = companyBankRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Company account not found"));
        return mapToDTO(account);
    }


    // Add funds to an account using accountNumber
    public void addFunds(String accountNumber, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Amount must be positive");
        }

        // Find account by accountNumber
        CompanyBankAccount account = companyBankRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Company account not found"));

        // Add the funds
        account.setBalance(account.getBalance().add(amount));
        account.setLastUpdated(LocalDateTime.now());

        // Save the updated account
        companyBankRepository.save(account);
    }


    // Map entity to DTO
    private CompanyBankAccountDTO mapToDTO(CompanyBankAccount account) {
        return CompanyBankAccountDTO.builder()
                .accountNumber(account.getAccountNumber())
                .accountName(account.getAccountName())
                .bankName(account.getBankName())
                .branchName(account.getBranchName())
                .balance(account.getBalance())
                .build();
    }
}
