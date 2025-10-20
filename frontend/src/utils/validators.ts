// src/utils/validators.ts

// Export each validator so it can be imported elsewhere
export const validateEmployeeId = (id: string): boolean => {
    const regex = /^\d{4}$/;
    return regex.test(id);
};

export const validateName = (name: string): boolean => {
    return name.trim().length > 0;
};

export const validateGrade = (grade: number): boolean => {
    return grade >= 1 && grade <= 6;
};

export const validateMobile = (mobile: string): boolean => {
    const regex = /^\d{10}$/;
    return regex.test(mobile);
};

export const validateBankAccountNumber = (accountNumber: string): boolean => {
    const regex = /^\d{10,12}$/; // 10 to 12 digits
    return regex.test(accountNumber);
};

export const validateBalance = (balance: number): boolean => {
    return balance >= 0;
};

export const validateSalary = (salary: number): boolean => {
    return salary > 0;
};
