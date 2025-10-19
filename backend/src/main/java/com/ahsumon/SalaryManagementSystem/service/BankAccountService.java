package com.ahsumon.SalaryManagementSystem.service;

import com.ahsumon.SalaryManagementSystem.dto.BankAccountDTO;
import com.ahsumon.SalaryManagementSystem.entity.BankAccount;
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
                .accountHolder(dto.getAccountHolder())
                .currentBalance(dto.getCurrentBalance())
                .build();

        BankAccount saved = bankAccountRepository.save(account);
        return mapToDTO(saved);
    }

    public BankAccountDTO getAccount(Long accountId) {
        return mapToDTO(bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank account not found")));
    }

    public List<BankAccountDTO> getAllAccounts() {
        return bankAccountRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BankAccountDTO updateAccount(Long accountId, BankAccountDTO dto) {
        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank account not found"));

        account.setAccountHolder(dto.getAccountHolder());
        account.setCurrentBalance(dto.getCurrentBalance());

        return mapToDTO(bankAccountRepository.save(account));
    }

    public void deleteAccount(Long accountId) {
        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank account not found"));
        bankAccountRepository.delete(account);
    }

    private BankAccountDTO mapToDTO(BankAccount account) {
        return BankAccountDTO.builder()
                .accountNumber(account.getAccountNumber())
                .accountHolder(account.getAccountHolder())
                .currentBalance(account.getCurrentBalance())
                .build();
    }
}
