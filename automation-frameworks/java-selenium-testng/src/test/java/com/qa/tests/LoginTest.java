package com.qa.tests;

import com.qa.pages.LoginPage;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LoginTest {

    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeMethod
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new"); // Run headless in CI/CD
        options.addArguments("--window-size=1920,1080");

        driver = new ChromeDriver(options);
        driver.get("http://127.0.0.1:5500/index.html");
        loginPage = new LoginPage(driver);
    }

    @Test(description = "TC-101: Verify Form Password Strength Meter interaction")
    public void testPasswordStrengthValidation() {
        loginPage.enterEmail("testuser@company.com");
        loginPage.enterPassword("Pass123!Secure");
        
        Assert.assertTrue(loginPage.isPasswordMeterActive(), "Password strength meter should be active");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
