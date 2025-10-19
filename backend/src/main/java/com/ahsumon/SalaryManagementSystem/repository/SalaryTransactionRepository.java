package com.ahsumon.SalaryManagementSystem.repository;

import com.ahsumon.SalaryManagementSystem.entity.Employee;
import com.ahsumon.SalaryManagementSystem.entity.SalaryTransaction;
import com.ahsumon.SalaryManagementSystem.enums.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalaryTransactionRepository extends JpaRepository<SalaryTransaction, Long> {
    List<SalaryTransaction> findByEmployee(Employee employee);
    List<SalaryTransaction> findByStatus(TransactionStatus status); // enum type for safety
}
