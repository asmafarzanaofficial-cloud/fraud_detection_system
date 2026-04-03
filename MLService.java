package com.bank.frauddetection.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.bank.frauddetection.model.MLResponse;

@Service
public class MLService {

    private final String ML_API_URL = "http://localhost:5000/predict";

    public int getPrediction(double[] features) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> request = new HashMap<>();
            request.put("features", features);

            MLResponse response =
                    restTemplate.postForObject(ML_API_URL, request, MLResponse.class);

            if (response != null) {
                return response.getFraud();
            }

        } catch (Exception e) {
            // 🔥 VERY IMPORTANT: prevent crash
            System.out.println("⚠️ ML SERVICE DOWN → using fallback");
        }

        return 0; // fallback → no crash
    }
}
