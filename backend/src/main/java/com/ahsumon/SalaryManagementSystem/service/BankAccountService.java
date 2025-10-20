package com.ahsumon.SalaryManagementSystem.service;

import com.ahsumon.SalaryManagementSystem.dto.BankAccountDTO;
import com.ahsumon.SalaryManagementSystem.entity.BankAccount;
import com.ahsumon.SalaryManagementSystem.exception.ResourceNotFoundException;
import com.ahsumon.SalaryManagementSystem.repository.BankAccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BankAccountService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    public BankAccountDTO createAccount(BankAccountDTO dto) {
        BankAccount account = BankAccount.builder()
                .accountNumber(dto.getAccountNumber())
                .accountName(dto.getAccountName())
                .accountType(dto.getAccountType())
                .bankName(dto.getBankName())
                .branchName(dto.getBranchName())
                .currentBalance(dto.getCurrentBalance())
                .build();

        BankAccount saved = bankAccountRepository.save(account);
        return mapToDTO(saved);
    }

    public BankAccountDTO getAccountByNumber(String accountNumber) {
        return mapToDTO(bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bank account not found with account number: " + accountNumber)));
    }

    public List<BankAccountDTO> getAllAccounts() {
        return bankAccountRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Update by account number
    public BankAccountDTO updateAccountByNumber(String accountNumber, BankAccountDTO dto) {
        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bank account not found with account number: " + accountNumber));

        account.setAccountName(dto.getAccountName());
        account.setAccountType(dto.getAccountType());
        account.setBankName(dto.getBankName());
        account.setBranchName(dto.getBranchName());
        account.setCurrentBalance(dto.getCurrentBalance());

        return mapToDTO(bankAccountRepository.save(account));
    }

    // Delete by account number
    public void deleteAccountByNumber(String accountNumber) {
        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bank account not found with account number: " + accountNumber));
        bankAccountRepository.delete(account);
    }

    private BankAccountDTO mapToDTO(BankAccount account) {
        return BankAccountDTO.builder()
                .accountNumber(account.getAccountNumber())
                .accountName(account.getAccountName())
                .accountType(account.getAccountType())
                .bankName(account.getBankName())
                .branchName(account.getBranchName())
                .currentBalance(account.getCurrentBalance())
                .build();
    }
}
