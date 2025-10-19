package com.ahsumon.SalaryManagementSystem.controller;



import com.ahsumon.SalaryManagementSystem.dto.CompanyBankAccountDTO;
import com.ahsumon.SalaryManagementSystem.dto.ApiResponse;
import com.ahsumon.SalaryManagementSystem.service.CompanyBankService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/company-bank")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class CompanyBankController {

    @Autowired
    private CompanyBankService companyBankService;

    @PostMapping
    public ResponseEntity<ApiResponse<CompanyBankAccountDTO>> createCompanyAccount(
            @Valid @RequestBody CompanyBankAccountDTO dto) {
        log.info("Creating new company bank account for account number: {}", dto.getAccountNumber());
        try {
            CompanyBankAccountDTO created = companyBankService.createCompanyAccount(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Company bank account created successfully", created, true));
        } catch (Exception e) {
            log.error("Error creating company bank account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Failed to create company bank account", null, false));
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse<CompanyBankAccountDTO>> getCompanyAccount(@PathVariable Long accountId) {
        log.info("Fetching company bank account with ID: {}", accountId);
        try {
            CompanyBankAccountDTO account = companyBankService.getCompanyAccount(accountId);
            return ResponseEntity.ok(new ApiResponse<>("Company bank account retrieved successfully", account, true));
        } catch (Exception e) {
            log.error("Error fetching company bank account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Company bank account not found", null, false));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompanyBankAccountDTO>>> getAllCompanyAccounts() {
        log.info("Fetching all company bank accounts");
        try {
            List<CompanyBankAccountDTO> accounts = companyBankService.getAllCompanyAccounts();
            return ResponseEntity.ok(new ApiResponse<>("All company bank accounts retrieved", accounts, true));
        } catch (Exception e) {
            log.error("Error fetching company bank accounts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to fetch company bank accounts", null, false));
        }
    }

    @PostMapping("/{accountId}/add-funds")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addFundsToAccount(
            @PathVariable Long accountId,
            @RequestParam BigDecimal amount) {
        log.info("Adding funds to company account ID: {} - Amount: {}", accountId, amount);
        try {
            companyBankService.addFunds(accountId, amount);

            Map<String, Object> response = new HashMap<>();
            response.put("accountId", accountId);
            response.put("amountAdded", amount);
            response.put("timestamp", System.currentTimeMillis());
            response.put("message", "Funds added successfully");

            return ResponseEntity.ok(new ApiResponse<>("Funds added successfully", response, true));
        } catch (Exception e) {
            log.error("Error adding funds: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Failed to add funds: " + e.getMessage(), null, false));
        }
    }

    @GetMapping("/{accountId}/balance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAccountBalance(@PathVariable Long accountId) {
        log.info("Fetching balance for company account ID: {}", accountId);
        try {
            CompanyBankAccountDTO account = companyBankService.getCompanyAccount(accountId);

            Map<String, Object> response = new HashMap<>();
            response.put("accountId", accountId);
            response.put("accountNumber", account.getAccountNumber());
            response.put("balance", account.getBalance());
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(new ApiResponse<>("Account balance retrieved", response, true));
        } catch (Exception e) {
            log.error("Error fetching account balance: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Account not found", null, false));
        }
    }
}
