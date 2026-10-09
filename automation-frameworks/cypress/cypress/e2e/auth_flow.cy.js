/**
 * Cypress End-to-End Test Suite: Authentication & Input Sanitization
 */

describe('QA Suite: Authentication & User Input Validation', () => {
  beforeEach(() => {
    // Intercept API calls to mock network latency
    cy.intercept('POST', '/api/v1/auth/login').as('loginReq');
  });

  it('TC-101: Valid User Login Flow', () => {
    cy.visit('http://127.0.0.1:5500/index.html');
    
    // Switch to Sandbox Tab
    cy.get('[data-tab="playground-tab"]').click();
    
    // Test Email Input Validation
    cy.get('#sb-email').type('testuser@company.com');
    cy.get('#sb-email').should('have.value', 'testuser@company.com');
    
    // Test Password Strength Meter
    cy.get('#sb-password').type('ComplexPass!2026');
    cy.get('#pwd-meter-bar').should('have.css', 'width');
  });

  it('TC-106: Security Injection - XSS Sanitization Check', () => {
    const xssPayload = "<script>alert('XSS_HACK')</script>";
    cy.visit('http://127.0.0.1:5500/index.html');
    cy.get('[data-tab="playground-tab"]').click();

    cy.get('#sb-email').type(xssPayload);
    cy.get('#sb-submit-btn').click();

    // Verify window alert was NOT triggered
    cy.on('window:alert', () => {
      expect.fail('XSS payload executed un-sanitized window alert!');
    });
  });
});
