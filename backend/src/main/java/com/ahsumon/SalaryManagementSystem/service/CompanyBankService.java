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

    public CompanyBankAccountDTO createCompanyAccount(CompanyBankAccountDTO dto) {
        CompanyBankAccount account = CompanyBankAccount.builder()
                .accountNumber(dto.getAccountNumber())
                .balance(dto.getBalance())
                .build();

        return mapToDTO(companyBankRepository.save(account));
    }

    public CompanyBankAccountDTO getCompanyAccount(Long accountId) {
        CompanyBankAccount account = companyBankRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Company account not found"));
        return mapToDTO(account);
    }

    public List<CompanyBankAccountDTO> getAllCompanyAccounts() {
        return companyBankRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void addFunds(Long accountId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Amount must be positive");
        }

        CompanyBankAccount account = companyBankRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Company account not found"));
        account.setBalance(account.getBalance().add(amount));
        account.setLastUpdated(LocalDateTime.now());
        companyBankRepository.save(account);
    }

    private CompanyBankAccountDTO mapToDTO(CompanyBankAccount account) {
        return CompanyBankAccountDTO.builder()
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .build();
    }
}
