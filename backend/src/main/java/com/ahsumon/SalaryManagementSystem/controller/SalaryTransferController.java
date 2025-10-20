package com.ahsumon.SalaryManagementSystem.controller;

import com.ahsumon.SalaryManagementSystem.dto.ApiResponse;
import com.ahsumon.SalaryManagementSystem.dto.SalarySheetDTO;
import com.ahsumon.SalaryManagementSystem.service.SalaryTransferService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/salary-transfer")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class SalaryTransferController {

    @Autowired
    private SalaryTransferService salaryTransferService;

    /**
     * ✅ Process salary transfer for all employees using company account number.
     */
    @PostMapping("/{accountNumber}/process")
    public ResponseEntity<ApiResponse<SalarySheetDTO>> processSalaryTransfer(@PathVariable String accountNumber) {
        log.info("Processing salary transfer for company account number: {}", accountNumber);
        try {
            SalarySheetDTO salarySheet = salaryTransferService.processSalaryTransfer(accountNumber);
            return ResponseEntity.ok(new ApiResponse<>("Salary transfer processed successfully", salarySheet, true));
        } catch (Exception e) {
            log.error("Error processing salary transfer: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Failed to process salary transfer: " + e.getMessage(), null, false));
        }
    }

    /**
     * ✅ Add funds to a company account using its account number (not ID).
     */
    @PostMapping("/{accountNumber}/add-funds")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addFundsToCompanyAccount(
            @PathVariable String accountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false, defaultValue = "Manual deposit") String description) {

        log.info("Adding funds to company account: {} - Amount: {}", accountNumber, amount);
        try {
            salaryTransferService.addFundsToCompanyAccount(accountNumber, amount);

            Map<String, Object> response = new HashMap<>();
            response.put("accountNumber", accountNumber);
            response.put("amountAdded", amount);
            response.put("description", description);
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(new ApiResponse<>("Funds added successfully", response, true));
        } catch (Exception e) {
            log.error("Error adding funds: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Failed to add funds: " + e.getMessage(), null, false));
        }
    }

    /**
     * ✅ Fetch salary sheet (latest salary summary) for a specific company account number.
     */
    @GetMapping("/{accountNumber}/salary-sheet")
    public ResponseEntity<ApiResponse<SalarySheetDTO>> getSalarySheet(@PathVariable String accountNumber) {
        log.info("Fetching salary sheet for company account number: {}", accountNumber);
        try {
            SalarySheetDTO salarySheet = salaryTransferService.processSalaryTransfer(accountNumber);
            return ResponseEntity.ok(new ApiResponse<>("Salary sheet retrieved successfully", salarySheet, true));
        } catch (Exception e) {
            log.error("Error fetching salary sheet: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Failed to fetch salary sheet: " + e.getMessage(), null, false));
        }
    }
}
