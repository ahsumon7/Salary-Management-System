package com.ahsumon.SalaryManagementSystem.controller;

import com.ahsumon.SalaryManagementSystem.dto.BankAccountDTO;
import com.ahsumon.SalaryManagementSystem.dto.ApiResponse;
import com.ahsumon.SalaryManagementSystem.exception.ResourceNotFoundException;
import com.ahsumon.SalaryManagementSystem.service.BankAccountService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bank-accounts")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class BankAccountController {

    @Autowired
    private BankAccountService bankAccountService;

    @PostMapping
    public ResponseEntity<ApiResponse<BankAccountDTO>> createBankAccount(
            @Valid @RequestBody BankAccountDTO dto) {
        log.info("Creating bank account: {}", dto.getAccountNumber());
        try {
            BankAccountDTO created = bankAccountService.createAccount(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Bank account created successfully", created, true));
        } catch (Exception e) {
            log.error("Error creating bank account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Failed to create bank account", null, false));
        }
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<BankAccountDTO>> getBankAccount(@PathVariable String accountNumber) {
        log.info("Fetching bank account: {}", accountNumber);
        try {
            BankAccountDTO account = bankAccountService.getAccountByNumber(accountNumber);
            return ResponseEntity.ok(new ApiResponse<>("Bank account retrieved", account, true));
        } catch (ResourceNotFoundException e) {
            log.error("Error fetching bank account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null, false));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BankAccountDTO>>> getAllBankAccounts() {
        log.info("Fetching all bank accounts");
        try {
            List<BankAccountDTO> accounts = bankAccountService.getAllAccounts();
            return ResponseEntity.ok(new ApiResponse<>("All bank accounts retrieved", accounts, true));
        } catch (Exception e) {
            log.error("Error fetching bank accounts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to fetch bank accounts", null, false));
        }
    }

    @PutMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<BankAccountDTO>> updateBankAccount(
            @PathVariable String accountNumber,
            @Valid @RequestBody BankAccountDTO dto) {
        log.info("Updating bank account: {}", accountNumber);
        try {
            BankAccountDTO updated = bankAccountService.updateAccountByNumber(accountNumber, dto);
            return ResponseEntity.ok(new ApiResponse<>("Bank account updated successfully", updated, true));
        } catch (ResourceNotFoundException e) {
            log.error("Error updating bank account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null, false));
        }
    }

    @DeleteMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<?>> deleteBankAccount(@PathVariable String accountNumber) {
        log.info("Deleting bank account: {}", accountNumber);
        try {
            bankAccountService.deleteAccountByNumber(accountNumber);
            return ResponseEntity.ok(new ApiResponse<>("Bank account deleted successfully", null, true));
        } catch (ResourceNotFoundException e) {
            log.error("Error deleting bank account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null, false));
        }
    }
}
