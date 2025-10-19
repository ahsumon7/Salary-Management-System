package com.ahsumon.SalaryManagementSystem.controller;

import com.ahsumon.SalaryManagementSystem.dto.BankAccountDTO;
import com.ahsumon.SalaryManagementSystem.dto.ApiResponse;
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

    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse<BankAccountDTO>> getBankAccount(@PathVariable Long accountId) {
        log.info("Fetching bank account: {}", accountId);
        try {
            BankAccountDTO account = bankAccountService.getAccount(accountId);
            return ResponseEntity.ok(new ApiResponse<>("Bank account retrieved", account, true));
        } catch (Exception e) {
            log.error("Error fetching bank account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Bank account not found", null, false));
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

    @PutMapping("/{accountId}")
    public ResponseEntity<ApiResponse<BankAccountDTO>> updateBankAccount(
            @PathVariable Long accountId,
            @Valid @RequestBody BankAccountDTO dto) {
        log.info("Updating bank account: {}", accountId);
        try {
            BankAccountDTO updated = bankAccountService.updateAccount(accountId, dto);
            return ResponseEntity.ok(new ApiResponse<>("Bank account updated successfully", updated, true));
        } catch (Exception e) {
            log.error("Error updating bank account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Bank account not found", null, false));
        }
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<ApiResponse<?>> deleteBankAccount(@PathVariable Long accountId) {
        log.info("Deleting bank account: {}", accountId);
        try {
            bankAccountService.deleteAccount(accountId);
            return ResponseEntity.ok(new ApiResponse<>("Bank account deleted successfully", null, true));
        } catch (Exception e) {
            log.error("Error deleting bank account: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Bank account not found", null, false));
        }
    }
}
