# 🧪 QA Core Hub & Multi-Framework Automation Suite

> Enterprise-grade QA Engineering Control Center, Interactive Test Hub, Live API Sandbox, Bug Tracker, and Code Generator with ready-to-run automation frameworks in **Java (Selenium + REST Assured + TestNG)**, **Cypress (JS)**, **Playwright (TypeScript POM & Python)**, and **Pytest**.

---

## 🌟 Key Features

### 1. 📊 Interactive QA Control Hub (`index.html`)
- **Real-time QA Dashboard**: Track Test Execution Pass/Fail rates, Flakiness trend, Defect density, and Automation Coverage % using interactive Chart.js visuals.
- **Test Case Execution Suite**: Filter, search, and batch-run automated & manual test cases across Authentication, Checkout, REST API, Security, and Performance modules.
- **Live REST API Tester (Postman Sandbox)**: Execute real HTTP GET/POST/PUT/DELETE requests directly in the browser with automated status code, response latency, and payload key assertions.
- **Jira-Style Bug Tracker**: Kanban board with drag-and-drop defect lifecycle management (`OPEN` ➔ `IN_PROGRESS` ➔ `RETEST` ➔ `CLOSED`).
- **Automated Script Generator**: Convert any test case into production-ready test scripts for **Java (Selenium + REST Assured)**, **Cypress**, **Playwright TS**, **Playwright Python**, or **Selenium Pytest**.
- **QA Web Sandbox**: Interactive form validators, dynamic wait element launchers, and shadow DOM simulators for automation practice.
- **Executive Audit Report**: One-click print/PDF report generator tailored for engineering managers and stakeholders.

---

## 🏗️ Automation Framework Architectures Included

```
QA ENGG/
├── index.html                   # Interactive Web QA Control Center SPA
├── styles.css                   # Dark/Light Glassmorphism Design System
├── app.js                       # Single Page App Engine & Test Execution Logic
├── automation-frameworks/
│   ├── java-selenium-testng/    # ☕ Java Selenium WebDriver & REST Assured TestNG Suite
│   │   ├── pom.xml              # Maven dependencies (Selenium, REST Assured, TestNG)
│   │   ├── testng.xml           # TestNG Suite XML Config
│   │   └── src/
│   │       ├── main/java/com/qa/pages/  # Page Object Model (BasePage, LoginPage)
│   │       └── test/java/com/qa/tests/  # TestNG Tests (LoginTest, ApiUserTest)
│   ├── cypress/                 # 🌲 Cypress JS E2E Automation Framework
│   │   ├── cypress.config.js
│   │   └── cypress/e2e/         # Cypress Specs (auth_flow.cy.js)
│   ├── playwright-ts/           # 🎭 Playwright TypeScript POM Framework
│   │   ├── playwright.config.ts
│   │   ├── pages/               # TypeScript POM (LoginPage.ts)
│   │   └── tests/               # Playwright Specs (login_pom.spec.ts)
│   ├── pytest-selenium/         # 🐍 Python Pytest + Selenium Framework
│   │   ├── conftest.py          # Pytest ChromeDriver Fixture
│   │   └── test_e2e_checkout.py # Pytest E2E & API test specs
│   └── postman/                 # 🚀 Postman API Collection & Environment JSON
└── qa-documentation/
    ├── test_strategy_plan.md    # Comprehensive QA Test Plan & Strategy
    └── bug_reporting_standard.md
```

---

## 🚀 How to Run

### 1. Launch the Interactive Web QA Control Center
Simply double click `index.html` or open with Live Server in VS Code / Browser:
```bash
# Open directly in default web browser
start index.html
```

### 2. Run Java Automation Suite (Selenium + REST Assured + TestNG)
```bash
cd automation-frameworks/java-selenium-testng
mvn clean test
```

### 3. Run Cypress Test Suite
```bash
cd automation-frameworks/cypress
npm install
npm run cypress:run
```

### 4. Run Playwright TypeScript Suite
```bash
cd automation-frameworks/playwright-ts
npm install
npx playwright test
```

### 5. Run Python Pytest Suite
```bash
cd automation-frameworks/pytest-selenium
pip install -r requirements.txt
pytest -v
```

---

## 📝 License & Author
Built for QA Automation Engineers, SDETs, and Software Quality Teams.
License: MIT.
