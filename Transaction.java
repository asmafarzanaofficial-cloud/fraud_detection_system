package com.bank.frauddetection.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    private double amount;
    private String location;
    private String merchant;
    private String transactionType;

    private boolean suspicious;

    private LocalDateTime timestamp;

    // ✅ ADD THESE FIELDS (VERY IMPORTANT)
    private boolean actualFraud;
    private int fraudScore;
    private boolean mlPrediction;
    private boolean ruleTriggered;

    // ================= GETTERS & SETTERS =================

    public Long getId() { return id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public boolean isSuspicious() { return suspicious; }
    public void setSuspicious(boolean suspicious) { this.suspicious = suspicious; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // ✅ NEW GETTERS & SETTERS

    public boolean isActualFraud() { return actualFraud; }
    public void setActualFraud(boolean actualFraud) { this.actualFraud = actualFraud; }

    public int getFraudScore() { return fraudScore; }
    public void setFraudScore(int fraudScore) { this.fraudScore = fraudScore; }

    public boolean isMlPrediction() { return mlPrediction; }
    public void setMlPrediction(boolean mlPrediction) { this.mlPrediction = mlPrediction; }

    public boolean isRuleTriggered() { return ruleTriggered; }
    public void setRuleTriggered(boolean ruleTriggered) { this.ruleTriggered = ruleTriggered; }
}
