package com.ahsumon.SalaryManagementSystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "salary_sheets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalarySheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate generatedDate;

    @Column(precision = 14, scale = 2)
    private BigDecimal totalPaidSalary;

    @Column(precision = 14, scale = 2)
    private BigDecimal companyBalanceBefore;

    @Column(precision = 14, scale = 2)
    private BigDecimal companyBalanceAfter;

    private Integer transactionCount;
    private Integer successfulCount;
    private Integer failedCount;

    @PrePersist
    public void prePersist() {
        this.generatedDate = LocalDate.now();
    }
}
