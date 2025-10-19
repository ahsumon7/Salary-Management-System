package com.ahsumon.SalaryManagementSystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private String employeeId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Grade is required")
    private Integer gradeId;

    @NotBlank(message = "Address is required")
    private String address;

    @Pattern(regexp = "\\d{10,11}", message = "Mobile must be 10-11 digits")
    private String mobile;

    @NotNull(message = "Bank account is required")
    private BankAccountDTO bankAccount;
}
