package com.bank.frauddetection.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bank.frauddetection.model.Alert;
import com.bank.frauddetection.repository.AlertRepository;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertRepository alertRepo;

    public AlertController(AlertRepository alertRepo) {
        this.alertRepo = alertRepo;
    }

    @GetMapping
    public Iterable<Alert> getAllAlerts() {
        return alertRepo.findAll();
    }
}
