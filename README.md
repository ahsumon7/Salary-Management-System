💰 Salary Management System
🚀 Project Overview

The Salary Management System is a web application designed to calculate and manage employee salaries automatically. It supports multiple employee grades, bank accounts, salary calculations with allowances, salary transfers, and comprehensive reporting.

✨ Features

Employee Management: CRUD operations with unique 4-digit Employee IDs.

Grade Management: Six grades/ranks; salary hierarchy maintained.

Bank Account Management: CRUD for employee and company accounts.

Salary Calculation:

Basic salary per grade.

House Rent: 20% of basic.

Medical Allowance: 15% of basic.

Higher grade salary = previous grade basic + 5000 Taka.

Salary Transfer: Transfer salaries from company account to employee accounts. Option to top-up company account if funds are insufficient.

Reports:

Employee salary sheet

Total salary paid

Remaining company balance

Authentication: JWT-based Login/Logout.

🛠 Tech Stack

Frontend: React

Backend: Spring Boot (REST API)

Database: PostgreSQL

API Documentation: Swagger (http://localhost:8080/swagger-ui/index.html
)

Authentication: JWT

🔗 REST API Endpoints


Grades

GET /api/v1/grades — List all grades

POST /api/v1/grades — Create grade

GET /api/v1/grades/{gradeId} — Get grade details

PUT /api/v1/grades/{gradeId} — Update grade

DELETE /api/v1/grades/{gradeId} — Delete grade

Employees

GET /api/v1/employees — List all employees

POST /api/v1/employees — Create employee

GET /api/v1/employees/{employeeId} — Employee details

PUT /api/v1/employees/{employeeId} — Update employee

DELETE /api/v1/employees/{employeeId} — Delete employee

Bank Accounts

GET /api/v1/bank-accounts — List all accounts

POST /api/v1/bank-accounts — Add account

GET /api/v1/bank-accounts/{accountNumber} — Account details

PUT /api/v1/bank-accounts/{accountNumber} — Update account

DELETE /api/v1/bank-accounts/{accountNumber} — Delete account

Salary

GET /api/v1/salary/{employeeId}/details — Salary details

GET /api/v1/salary/{employeeId}/breakdown — Salary breakdown

GET /api/v1/salary/calculate/{employeeId} — Calculate salary

GET /api/v1/salary/all — Calculate all salaries

POST /api/v1/salary-transfer/{accountNumber}/process — Transfer salary

POST /api/v1/salary-transfer/{accountNumber}/add-funds — Add funds to company account

Reports

POST /api/v1/reports/generate-sheet — Generate salary sheet

GET /api/v1/reports/sheet/{sheetId} — Get specific salary sheet

GET /api/v1/reports/company-summary/{accountNumber} — Company summary

GET /api/v1/reports/all-sheets — All salary sheets

Authentication

POST /api/auth/login — Login

POST /api/auth/register — Register user

POST /api/auth/logout — Logout

POST /api/auth/refresh-token — Refresh JWT

GET /api/auth/validate-token — Validate JWT

⚙ Getting Started
Backend
# Install Java 21 and Maven
# Configure PostgreSQL database
# Update application.properties with DB credentials

# Run Spring Boot
mvn spring-boot:run


Swagger API: http://localhost:8080/swagger-ui/index.html

Frontend
# Install Node.js and npm
cd frontend

# Install dependencies
npm install

# Run React app
npm start

🐳 Docker Setup

The project is fully Dockerized for easy deployment.

Prerequisites

Docker

Docker Compose

Run with Docker

From the project root:

docker-compose up --build


Frontend: http://localhost:3000

Backend: http://localhost:8080

PostgreSQL: Port 5432

Docker Compose Services
Service	Description
postgres	PostgreSQL database with persistent volume postgres-data
backend	Spring Boot API connected to PostgreSQL
frontend	React app served via Nginx
Stop and Remove Containers
docker-compose down

📝 Usage

Register or login as admin.

Add company bank account and initial balance.

Add employees and grades.

Calculate salaries and transfer to employee accounts.

Generate reports and view the dashboard.

👤 Author

Abdul Hannan Sumon
