package com.ahsumon.SalaryManagementSystem.controller;



import com.ahsumon.SalaryManagementSystem.dto.SalarySheetDTO;
import com.ahsumon.SalaryManagementSystem.dto.ApiResponse;
import com.ahsumon.SalaryManagementSystem.service.ReportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Requirement 7: Get employee salary sheet with name, rank, and salary
     */
    @GetMapping("/salary-sheet")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEmployeeSalarySheet() {
        log.info("Endpoint: GET /salary-sheet - Employee salary sheet");
        try {
            Map<String, Object> salarySheet = reportService.getEmployeeSalarySheet();
            return ResponseEntity.ok(new ApiResponse<>("Employee salary sheet retrieved successfully", salarySheet, true));
        } catch (Exception e) {
            log.error("Error retrieving employee salary sheet: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to retrieve employee salary sheet", null, false));
        }
    }

    /**
     * Requirement 8: Get company account summary with total paid salary and remaining balance
     */
    @GetMapping("/company-summary/{accountNumber}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCompanyAccountSummary(
            @PathVariable String accountNumber) {
        log.info("Endpoint: GET /company-summary/{} - Company account summary", accountNumber);
        try {
            Map<String, Object> summary = reportService.getCompanyAccountSummary(accountNumber);
            return ResponseEntity.ok(new ApiResponse<>("Company account summary retrieved successfully", summary, true));
        } catch (Exception e) {
            log.error("Error retrieving company account summary: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Failed to retrieve company account summary: " + e.getMessage(), null, false));
        }
    }

    /**
     * Get all salary sheets
     */
    @GetMapping("/all-sheets")
    public ResponseEntity<ApiResponse<List<SalarySheetDTO>>> getAllSalarySheets() {
        log.info("Endpoint: GET /all-sheets - All salary sheets");
        try {
            List<SalarySheetDTO> sheets = reportService.getAllSalarySheets();
            return ResponseEntity.ok(new ApiResponse<>("All salary sheets retrieved successfully", sheets, true));
        } catch (Exception e) {
            log.error("Error retrieving all salary sheets: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to retrieve salary sheets", null, false));
        }
    }
    @PostMapping("/generate-sheet")
    public ResponseEntity<ApiResponse<SalarySheetDTO>> generateSalarySheet() {
        log.info("Endpoint: POST /generate-sheet - Generate new salary sheet");
        SalarySheetDTO sheet = reportService.generateSalarySheet();
        return ResponseEntity.ok(new ApiResponse<>("Salary sheet generated successfully", sheet, true));
    }


    /**
     * Get specific salary sheet by ID
     */
    @GetMapping("/sheet/{sheetId}")
    public ResponseEntity<ApiResponse<SalarySheetDTO>> getSalarySheet(@PathVariable Long sheetId) {
        log.info("Endpoint: GET /sheet/{} - Specific salary sheet", sheetId);
        try {
            SalarySheetDTO sheet = reportService.getSalarySheet(sheetId);
            return ResponseEntity.ok(new ApiResponse<>("Salary sheet retrieved successfully", sheet, true));
        } catch (Exception e) {
            log.error("Error retrieving salary sheet: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Failed to retrieve salary sheet: " + e.getMessage(), null, false));
        }
    }
}
