package com.qa.tests;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

/**
 * REST Assured Java API Automation Test Suite for REST API validation.
 */
public class ApiUserTest {

    @BeforeClass
    public void setupBaseUri() {
        RestAssured.baseURI = "https://jsonplaceholder.typicode.com";
    }

    @Test(description = "TC-103: GET /users endpoint returns 200 OK and valid JSON array")
    public void testGetUsersList() {
        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/users")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("size()", greaterThan(0))
            .body("[0].id", equalTo(1))
            .body("[0].username", notNullValue());
    }

    @Test(description = "TC-105: POST /posts creates resource and returns 201 Created")
    public void testCreatePostResource() {
        String payload = """
            {
                "title": "QA Automation Post",
                "body": "Testing REST Assured with Java and TestNG",
                "userId": 1
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(payload)
        .when()
            .post("/posts")
        .then()
            .statusCode(201)
            .body("title", equalTo("QA Automation Post"))
            .body("id", notNullValue());
    }
}
