package com.ahsumon.SalaryManagementSystem.entity;

import com.ahsumon.SalaryManagementSystem.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "salary_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private LocalDate transactionDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 12, scale = 2)
    private BigDecimal houseRent; // 20%

    @Column(precision = 12, scale = 2)
    private BigDecimal medicalAllowance; // 15%

    @Column(precision = 12, scale = 2)
    private BigDecimal totalSalary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status; // SUCCESS / FAILED / PENDING

    private String remarks;
}

