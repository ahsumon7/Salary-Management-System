/**
 * @typedef {Object} BankAccount
 * @property {'savings' | 'current'} accountType
 * @property {string} accountName
 * @property {string} accountNumber
 * @property {number} currentBalance
 * @property {string} bankName
 * @property {string} branchName
 */

/**
 * @typedef {Object} Employee
 * @property {string} id  // 4-digit unique employee ID
 * @property {string} name
 * @property {number} grade // 1 to 6
 * @property {string} address
 * @property {string} mobile
 * @property {BankAccount} bankAccount
 */

/**
 * @typedef {Object} Grade
 * @property {number} id // Grade ID
 * @property {string} name // Grade name (e.g., "Grade 1")
 * @property {number} basicSalary // Basic salary for the grade
 */

/**
 * @typedef {Object} CompanyAccount
 * @property {string} accountNumber
 * @property {number} balance
 */

/**
 * @typedef {Object} SalaryBreakdown
 * @property {number} basic
 * @property {number} houseRent // 20% of basic
 * @property {number} medicalAllowance // 15% of basic
 * @property {number} totalSalary // Sum of all components
 */

/**
 * @typedef {Object} SalarySheet
 * @property {string} employeeId
 * @property {string} employeeName
 * @property {number} grade
 * @property {number} salary
 */

/**
 * @typedef {Object} CompanySummary
 * @property {number} totalPaidSalary
 * @property {number} remainingBalance
 */
