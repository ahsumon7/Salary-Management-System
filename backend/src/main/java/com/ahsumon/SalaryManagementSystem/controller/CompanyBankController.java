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

    @GetMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<CompanyBankAccountDTO>> getCompanyAccount(
            @PathVariable String accountNumber) {
        log.info("Fetching company bank account with Account Number: {}", accountNumber);
        try {
            CompanyBankAccountDTO account = companyBankService.getCompanyAccountByNumber(accountNumber);
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

    @PostMapping("/{accountNumber}/add-funds")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addFundsToAccount(
            @PathVariable String accountNumber,
            @RequestParam BigDecimal amount) {
        log.info("Adding funds to company account Number: {} - Amount: {}", accountNumber, amount);
        try {
            // Call service using accountNumber
            companyBankService.addFunds(accountNumber, amount);

            Map<String, Object> response = new HashMap<>();
            response.put("accountNumber", accountNumber);
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


    @GetMapping("/{accountNumber}/balance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAccountBalance(@PathVariable String accountNumber) {
        log.info("Fetching balance for company account Number: {}", accountNumber);
        try {
            // Fetch account by accountNumber
            CompanyBankAccountDTO account = companyBankService.getCompanyAccountByNumber(accountNumber);

            Map<String, Object> response = new HashMap<>();
            response.put("accountNumber", account.getAccountNumber());
            response.put("accountName", account.getAccountName());
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
