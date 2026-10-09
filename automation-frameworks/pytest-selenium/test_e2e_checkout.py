import pytest
import requests
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestCheckoutFlow:

    @pytest.mark.ui
    def test_tc101_sandbox_form_validation(self, driver):
        driver.get("http://127.0.0.1:5500/index.html")
        
        # Navigate to QA Sandbox Tab
        tab_btn = driver.find_element(By.CSS_SELECTOR, '[data-tab="playground-tab"]')
        tab_btn.click()
        
        email_field = driver.find_element(By.ID, "sb-email")
        email_field.send_keys("qa_engineer@test.com")
        
        assert email_field.get_attribute("value") == "qa_engineer@test.com"

    @pytest.mark.api
    def test_tc103_rest_api_users(self):
        url = "https://jsonplaceholder.typicode.com/users"
        response = requests.get(url, timeout=5)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert "email" in data[0]
