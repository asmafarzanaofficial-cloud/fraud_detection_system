package com.bank.frauddetection.auth.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    // ✅ STATIC USERS
    private static final String ADMIN_EMAIL = "fraudadmin@gmail.com";
    private static final String ADMIN_PASS = "admin@2222";

    private static final String ANALYST_EMAIL = "analyst@gmail.com";
    private static final String ANALYST_PASS = "analyst123";

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        Map<String, String> response = new HashMap<>();

        // ✅ ADMIN LOGIN
        if (ADMIN_EMAIL.equals(email) && ADMIN_PASS.equals(password)) {
            response.put("status", "success");
            response.put("role", "ADMIN");
            return response;
        }

        // ✅ ANALYST LOGIN
        if (ANALYST_EMAIL.equals(email) && ANALYST_PASS.equals(password)) {
            response.put("status", "success");
            response.put("role", "ANALYST");
            return response;
        }

        // ❌ INVALID LOGIN
        response.put("status", "failed");
        return response;
    }
}