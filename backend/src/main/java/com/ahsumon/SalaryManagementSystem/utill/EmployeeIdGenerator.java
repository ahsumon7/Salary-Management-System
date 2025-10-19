package com.ahsumon.SalaryManagementSystem.utill;



import com.ahsumon.SalaryManagementSystem.repository.EmployeeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmployeeIdGenerator {

    @Autowired
    private EmployeeRepository employeeRepository;

    public String generateUniqueEmployeeId() {
        String employeeId;
        boolean exists;

        do {
            int randomId = (int) (Math.random() * 9000) + 1000; // Generate 4-digit random number (1000-9999)
            employeeId = String.valueOf(randomId);
            exists = employeeRepository.findByEmployeeId(employeeId).isPresent();
        } while (exists);

        log.info("Generated unique employee ID: {}", employeeId);
        return employeeId;
    }
}
