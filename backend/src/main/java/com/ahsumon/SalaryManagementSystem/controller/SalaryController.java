package com.ahsumon.SalaryManagementSystem.controller;



import com.ahsumon.SalaryManagementSystem.dto.SalaryBreakdown;
import com.ahsumon.SalaryManagementSystem.dto.ApiResponse;
import com.ahsumon.SalaryManagementSystem.service.SalaryCalculationService;
import com.ahsumon.SalaryManagementSystem.repository.EmployeeRepository;
import com.ahsumon.SalaryManagementSystem.entity.Employee;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/salary")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class SalaryController {

    @Autowired
    private SalaryCalculationService salaryCalculationService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/calculate/{employeeId}")
    public ResponseEntity<ApiResponse<SalaryBreakdown>> calculateSalary(@PathVariable String employeeId) {
        log.info("Calculating salary for employee: {}", employeeId);
        try {
            Employee employee = employeeRepository.findByEmployeeId(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            SalaryBreakdown breakdown = salaryCalculationService.calculateSalary(employee);
            return ResponseEntity.ok(new ApiResponse<>("Salary calculated successfully", breakdown, true));
        } catch (Exception e) {
            log.error("Error calculating salary: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Failed to calculate salary: " + e.getMessage(), null, false));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> calculateAllSalaries() {
        log.info("Calculating salaries for all employees");
        try {
            List<Employee> employees = employeeRepository.findAll();
            List<Map<String, Object>> salaryList = employees.stream().map(employee -> {
                SalaryBreakdown breakdown = salaryCalculationService.calculateSalary(employee);

                Map<String, Object> salaryMap = new HashMap<>();
                salaryMap.put("employeeId", employee.getEmployeeId());
                salaryMap.put("employeeName", employee.getName());
                salaryMap.put("grade", employee.getGrade().getGradeLevel());
                salaryMap.put("basicSalary", breakdown.getBasicSalary());
                salaryMap.put("houseRent", breakdown.getHouseRent());
                salaryMap.put("medicalAllowance", breakdown.getMedicalAllowance());
                salaryMap.put("totalSalary", breakdown.getTotalSalary());

                return salaryMap;
            }).toList();

            return ResponseEntity.ok(new ApiResponse<>("All salaries calculated", salaryList, true));
        } catch (Exception e) {
            log.error("Error calculating all salaries: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to calculate salaries", null, false));
        }
    }

    @GetMapping("/{employeeId}/breakdown")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalaryBreakdown(@PathVariable String employeeId) {
        log.info("Fetching salary breakdown for employee: {}", employeeId);
        try {
            Employee employee = employeeRepository.findByEmployeeId(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            SalaryBreakdown breakdown = salaryCalculationService.calculateSalary(employee);

            Map<String, Object> response = new HashMap<>();
            response.put("employeeId", employee.getEmployeeId());
            response.put("employeeName", employee.getName());
            response.put("grade", employee.getGrade().getGradeLevel());
            response.put("baseSalary", breakdown.getBasicSalary());
            response.put("houseRent", breakdown.getHouseRent());
            response.put("houseRentPercentage", "20%");
            response.put("medicalAllowance", breakdown.getMedicalAllowance());
            response.put("medicalAllowancePercentage", "15%");
            response.put("totalSalary", breakdown.getTotalSalary());

            return ResponseEntity.ok(new ApiResponse<>("Salary breakdown retrieved", response, true));
        } catch (Exception e) {
            log.error("Error fetching salary breakdown: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Failed to fetch salary breakdown", null, false));
        }
    }

    @GetMapping("/{employeeId}/details")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalaryDetails(@PathVariable String employeeId) {
        log.info("Fetching detailed salary information for employee: {}", employeeId);
        try {
            Employee employee = employeeRepository.findByEmployeeId(employeeId)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            SalaryBreakdown breakdown = salaryCalculationService.calculateSalary(employee);
            BigDecimal basicSalary = breakdown.getBasicSalary();
            BigDecimal totalAllowances = breakdown.getHouseRent().add(breakdown.getMedicalAllowance());

            Map<String, Object> details = new HashMap<>();
            details.put("employeeId", employee.getEmployeeId());
            details.put("employeeName", employee.getName());
            details.put("grade", employee.getGrade().getGradeLevel());
            details.put("basicSalary", basicSalary);
            details.put("allowances", new HashMap<String, Object>() {{
                put("houseRent", breakdown.getHouseRent());
                put("medicalAllowance", breakdown.getMedicalAllowance());
                put("totalAllowances", totalAllowances);
            }});
            details.put("totalSalary", breakdown.getTotalSalary());
            details.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(new ApiResponse<>("Salary details retrieved", details, true));
        } catch (Exception e) {
            log.error("Error fetching salary details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Failed to fetch salary details", null, false));
        }
    }
}
