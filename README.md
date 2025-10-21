Salary Management System
Project Overview
The Salary Management System is a web application to calculate and manage employee salaries automatically. It supports multiple employee grades, bank accounts, salary calculations with allowances, and comprehensive reporting.
 
Features
•	Employee Management: CRUD operations with unique 4-digit Employee IDs.
•	Grade Management: Six grades/ranks; salary hierarchy maintained.
•	Bank Account Management: CRUD for employee and company accounts.
•	Salary Calculation:
o	Basic salary per grade.
o	House Rent: 20% of basic.
o	Medical Allowance: 15% of basic.
o	Salary of higher grades calculated based on previous grade + 5000 Taka.
•	Salary Transfer: Transfer salaries from company account to employee accounts. Top-up option if funds are insufficient.
•	Reports: Employee salary sheet, total salary paid, remaining company balance.
•	Authentication: JWT-based Login/Logout.
 
Tech Stack
•	Frontend: React
•	Backend: Spring Boot (REST API)
•	Database: PostgreSQL
•	API Documentation: Swagger (http://localhost:8080/swagger-ui/index.html)
•	Authentication: JWT
 
REST API Endpoints
Grades
•	GET /api/v1/grades — List all grades
•	POST /api/v1/grades — Create grade
•	GET /api/v1/grades/{gradeId} — Get grade details
•	PUT /api/v1/grades/{gradeId} — Update grade
•	DELETE /api/v1/grades/{gradeId} — Delete grade
Employees
•	GET /api/v1/employees — List all employees
•	POST /api/v1/employees — Create employee
•	GET /api/v1/employees/{employeeId} — Employee details
•	PUT /api/v1/employees/{employeeId} — Update employee
•	DELETE /api/v1/employees/{employeeId} — Delete employee
Bank Accounts
•	GET /api/v1/bank-accounts — List all accounts
•	POST /api/v1/bank-accounts — Add account
•	GET /api/v1/bank-accounts/{accountNumber} — Account details
•	PUT /api/v1/bank-accounts/{accountNumber} — Update account
•	DELETE /api/v1/bank-accounts/{accountNumber} — Delete account
Salary
•	GET /api/v1/salary/{employeeId}/details — Salary details
•	GET /api/v1/salary/{employeeId}/breakdown — Salary breakdown
•	GET /api/v1/salary/calculate/{employeeId} — Calculate salary
•	GET /api/v1/salary/all — Calculate all salaries
•	POST /api/v1/salary-transfer/{accountNumber}/process — Transfer salary
•	POST /api/v1/salary-transfer/{accountNumber}/add-funds — Add funds to company account
Reports
•	POST /api/v1/reports/generate-sheet — Generate salary sheet
•	GET /api/v1/reports/sheet/{sheetId} — Get specific salary sheet
•	GET /api/v1/reports/company-summary/{accountNumber} — Company summary
•	GET /api/v1/reports/all-sheets — All salary sheets
Authentication
•	POST /api/auth/login — Login
•	POST /api/auth/register — Register user
•	POST /api/auth/logout — Logout
•	POST /api/auth/refresh-token — Refresh JWT
•	GET /api/auth/validate-token — Validate JWT
 
Getting Started
Backend
1.	Install Java 21 and Maven.
2.	Configure PostgreSQL database.
3.	Update application.properties with DB credentials.
4.	Run Spring Boot:
mvn spring-boot:run
Swagger API: http://localhost:8080/swagger-ui/index.html
 
Frontend
1.	Install Node.js and npm.
2.	Navigate to frontend folder.
3.	Install dependencies:
npm install
4.	Run React app:
npm start
 
Docker Setup
This project is Dockerized for easy deployment. You can run the entire application (frontend, backend, and PostgreSQL) using Docker Compose.
Prerequisites
•	Install Docker
•	Install Docker Compose
Run with Docker
From the root directory:
docker-compose up --build
•	Frontend will run on http://localhost:3000
•	Backend will run on http://localhost:8080
•	PostgreSQL runs on port 5432
Docker Compose Services
•	postgres: PostgreSQL database with persistent volume postgres-data.
•	backend: Spring Boot API connected to PostgreSQL.
•	frontend: React app served via Nginx.
Stop and Remove Containers
docker-compose down
 
Usage
1.	Register or login as admin.
2.	Add company bank account and initial balance.
3.	Add employees and grades.
4.	Calculate salaries and transfer to employee accounts.
5.	Generate reports and view dashboard.
 
Author
Abdul Hannan Sumon
![Uploading image.png…]()
