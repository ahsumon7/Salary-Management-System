package com.ahsumon.SalaryManagementSystem.repository;

import com.ahsumon.SalaryManagementSystem.entity.CompanyBankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyBankAccountRepository extends JpaRepository<CompanyBankAccount, Long> {
    Optional<CompanyBankAccount> findByAccountNumber(String accountNumber);
    boolean existsByAccountNumber(String accountNumber); // added for uniqueness check
}
