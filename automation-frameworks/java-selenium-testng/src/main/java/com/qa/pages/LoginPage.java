package com.qa.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Page Object Model for QA Core Hub Login Sandbox Page.
 */
public class LoginPage extends BasePage {

    // Locators
    private final By emailInput = By.id("sb-email");
    private final By passwordInput = By.id("sb-password");
    private final By submitButton = By.id("sb-submit-btn");
    private final By passwordMeter = By.id("pwd-meter-bar");
    private final By errorFeedback = By.className("error-feedback");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public void enterEmail(String email) {
        sendKeys(emailInput, email);
    }

    public void enterPassword(String password) {
        sendKeys(passwordInput, password);
    }

    public void clickSubmit() {
        click(submitButton);
    }

    public boolean isPasswordMeterActive() {
        return isDisplayed(passwordMeter);
    }

    public String getErrorMessage() {
        return getText(errorFeedback);
    }
}
