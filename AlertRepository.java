package com.bank.frauddetection.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.frauddetection.model.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}