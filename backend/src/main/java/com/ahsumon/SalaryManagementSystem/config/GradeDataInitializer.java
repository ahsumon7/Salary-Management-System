package com.ahsumon.SalaryManagementSystem.config;



import com.ahsumon.SalaryManagementSystem.entity.Grade;
import com.ahsumon.SalaryManagementSystem.repository.GradeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class GradeDataInitializer implements CommandLineRunner {

    private final GradeRepository gradeRepository;

    public GradeDataInitializer(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (gradeRepository.count() == 0) {
            BigDecimal lowestBase = new BigDecimal("20000"); // Example lowest grade base salary

            for (int i = 1; i <= 6; i++) {
                Grade grade = Grade.builder()
                        .gradeId(i)
                        .gradeLevel("Grade " + i)
                        .baseSalary(lowestBase.add(BigDecimal.valueOf((i - 6) * 5000))) // increment
                        .description("Description for grade " + i)
                        .build();
                gradeRepository.save(grade);
            }

            System.out.println("Default grades created successfully!");
        }
    }
}
