package com.bank.frauddetection.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.frauddetection.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountNumber(String accountNumber);

    List<Transaction> findByAccountNumberAndTimestampAfter(String accountNumber, LocalDateTime time);

    Transaction findTopByAccountNumberOrderByTimestampDesc(String accountNumber);
}