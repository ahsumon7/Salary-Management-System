package com.ahsumon.SalaryManagementSystem.controller;


import com.ahsumon.SalaryManagementSystem.dto.EmployeeDTO;
import com.ahsumon.SalaryManagementSystem.dto.ApiResponse;
import com.ahsumon.SalaryManagementSystem.service.EmployeeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(
            @Valid @RequestBody EmployeeDTO dto) {
        log.info("Creating new employee: {}", dto.getName());
        try {
            EmployeeDTO created = employeeService.createEmployee(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Employee created successfully", created, true));
        } catch (Exception e) {
            log.error("Error creating employee: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Failed to create employee", null, false));
        }
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployee(@PathVariable String employeeId) {
        log.info("Fetching employee: {}", employeeId);
        try {
            EmployeeDTO employee = employeeService.getEmployee(employeeId);
            return ResponseEntity.ok(new ApiResponse<>("Employee retrieved successfully", employee, true));
        } catch (Exception e) {
            log.error("Error fetching employee: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Employee not found", null, false));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getAllEmployees() {
        log.info("Fetching all employees");
        try {
            List<EmployeeDTO> employees = employeeService.getAllEmployees();
            return ResponseEntity.ok(new ApiResponse<>("All employees retrieved", employees, true));
        } catch (Exception e) {
            log.error("Error fetching employees: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to fetch employees", null, false));
        }
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(
            @PathVariable String employeeId,
            @Valid @RequestBody EmployeeDTO dto) {
        log.info("Updating employee: {}", employeeId);
        try {
            EmployeeDTO updated = employeeService.updateEmployee(employeeId, dto);
            return ResponseEntity.ok(new ApiResponse<>("Employee updated successfully", updated, true));
        } catch (Exception e) {
            log.error("Error updating employee: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Employee not found", null, false));
        }
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<ApiResponse<?>> deleteEmployee(@PathVariable String employeeId) {
        log.info("Deleting employee: {}", employeeId);
        try {
            employeeService.deleteEmployee(employeeId);
            return ResponseEntity.ok(new ApiResponse<>("Employee deleted successfully", null, true));
        } catch (Exception e) {
            log.error("Error deleting employee: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Employee not found", null, false));
        }
    }
}
