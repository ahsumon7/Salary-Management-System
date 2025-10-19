package com.ahsumon.SalaryManagementSystem.service;


import com.ahsumon.SalaryManagementSystem.dto.BankAccountDTO;
import com.ahsumon.SalaryManagementSystem.dto.EmployeeDTO;
import com.ahsumon.SalaryManagementSystem.entity.BankAccount;
import com.ahsumon.SalaryManagementSystem.entity.Employee;
import com.ahsumon.SalaryManagementSystem.entity.Grade;
import com.ahsumon.SalaryManagementSystem.exception.ResourceNotFoundException;
import com.ahsumon.SalaryManagementSystem.repository.EmployeeRepository;
import com.ahsumon.SalaryManagementSystem.repository.GradeRepository;
import com.ahsumon.SalaryManagementSystem.utill.EmployeeIdGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private EmployeeIdGenerator idGenerator;

    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        String employeeId = idGenerator.generateUniqueEmployeeId();

        Grade grade = gradeRepository.findByGradeId(dto.getGradeId())
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));

        Employee employee = Employee.builder()
                .employeeId(employeeId)
                .name(dto.getName())
                .grade(grade)
                .address(dto.getAddress())
                .mobile(dto.getMobile())
                .createdAt(LocalDateTime.now())
                .build();

        Employee saved = employeeRepository.save(employee);
        return mapToDTO(saved);
    }

    public EmployeeDTO updateEmployee(String employeeId, EmployeeDTO dto) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        employee.setName(dto.getName());
        employee.setAddress(dto.getAddress());
        employee.setMobile(dto.getMobile());
        employee.setUpdatedAt(LocalDateTime.now());

        Employee updated = employeeRepository.save(employee);
        return mapToDTO(updated);
    }

    public void deleteEmployee(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employeeRepository.delete(employee);
    }

    public EmployeeDTO getEmployee(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return mapToDTO(employee);
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EmployeeDTO mapToDTO(Employee employee) {
        return EmployeeDTO.builder()
                .employeeId(employee.getEmployeeId())
                .name(employee.getName())
                .gradeId(employee.getGrade().getGradeId())
                .address(employee.getAddress())
                .mobile(employee.getMobile())
                .bankAccount(mapBankAccountToDTO(employee.getBankAccount()))
                .build();
    }

    private BankAccountDTO mapBankAccountToDTO(BankAccount bankAccount) {
        return BankAccountDTO.builder()
                .accountNumber(bankAccount.getAccountNumber())
                .accountName(bankAccount.getAccountName())
                .accountType(bankAccount.getAccountType())
                .bankName(bankAccount.getBankName())
                .branchName(bankAccount.getBranchName())
                .currentBalance(bankAccount.getCurrentBalance())
                .build();
    }
}
