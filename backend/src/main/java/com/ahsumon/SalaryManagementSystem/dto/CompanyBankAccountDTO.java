package com.ahsumon.SalaryManagementSystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyBankAccountDTO {

    @NotBlank
    private String accountName;
    @NotBlank
    private String bankName;
    @NotBlank
    private String branchName;
    @NotBlank
    private String accountNumber;
    @NotNull
    private BigDecimal balance;

}
