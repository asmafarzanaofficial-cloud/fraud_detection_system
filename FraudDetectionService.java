package com.bank.frauddetection.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bank.frauddetection.model.Alert;
import com.bank.frauddetection.model.Transaction;
import com.bank.frauddetection.repository.AlertRepository;
import com.bank.frauddetection.repository.TransactionRepository;

@Service
public class FraudDetectionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired(required = false)
    private MLService mlService;

    @Autowired(required = false)
    private EmailService emailService;

    public Transaction processTransaction(Transaction txn) {

        int score = 0;
        StringBuilder reasons = new StringBuilder();

        // ✅ ALWAYS SET TIMESTAMP
        txn.setTimestamp(LocalDateTime.now());

        // ✅ SAFE HISTORY
        List<Transaction> history =
                transactionRepository.findByAccountNumber(txn.getAccountNumber());

        if (history == null) {
            history = new ArrayList<>();
        }

        // ================= RULE ENGINE =================

        if (txn.getAmount() > 50000) {
            score += 30;
            reasons.append("High amount; ");
        }

        if (txn.getAmount() > 100000) {
            score += 50;
            reasons.append("Very high amount; ");
        }

        int hour = txn.getTimestamp().getHour();
        if (hour >= 0 && hour <= 5) {
            score += 10;
            reasons.append("Odd time; ");
        }

        LocalDateTime tenMinAgo = LocalDateTime.now().minusMinutes(10);

        List<Transaction> recent =
                transactionRepository.findByAccountNumberAndTimestampAfter(
                        txn.getAccountNumber(), tenMinAgo);

        if (recent != null && recent.size() > 5) {
            score += 25;
            reasons.append("Too many transactions; ");
        }

        Transaction lastTxn =
                transactionRepository.findTopByAccountNumberOrderByTimestampDesc(
                        txn.getAccountNumber());

        if (lastTxn != null &&
                lastTxn.getLocation() != null &&
                txn.getLocation() != null &&
                !lastTxn.getLocation().equals(txn.getLocation())) {

            score += 20;
            reasons.append("Location mismatch; ");
        }

        // ✅ FIXED LAMBDA ERROR (IMPORTANT)
        boolean knownMerchant = false;
        for (Transaction t : history) {
            if (t.getMerchant() != null &&
                t.getMerchant().equals(txn.getMerchant())) {
                knownMerchant = true;
                break;
            }
        }

        if (!knownMerchant) {
            score += 15;
            reasons.append("New merchant; ");
        }

        double avg = history.stream()
                .mapToDouble(Transaction::getAmount)
                .average()
                .orElse(0);

        if (avg > 0 && txn.getAmount() > avg * 3) {
            score += 25;
            reasons.append("Spending spike; ");
        }

        // ================= ML =================
        boolean mlFlag = false;

        try {
            if (mlService != null) {
                double[] features = { txn.getAmount() };
                int mlResult = mlService.getPrediction(features);

                if (mlResult == 1) {
                    score += 40;
                    reasons.append("ML detected fraud; ");
                    mlFlag = true;
                }
            }
        } catch (Exception e) {
            System.out.println("⚠️ ML FAILED: " + e.getMessage());
        }

        // ================= FINAL DECISION =================

        String severity = "LOW";

        if (score >= 60) {
            txn.setSuspicious(true);
            severity = "HIGH";
        } else if (score >= 40) {
            txn.setSuspicious(true);
            severity = "MEDIUM";
        } else {
            txn.setSuspicious(false);
        }

        // ================= SET DB FIELDS =================

        txn.setFraudScore(score);
        txn.setMlPrediction(mlFlag);
        txn.setRuleTriggered(score > 0);

        // Dummy actual fraud (for metrics)
        txn.setActualFraud(txn.isSuspicious());

        // ================= SAVE (IMPORTANT FIX) =================
        txn = transactionRepository.save(txn);

        // ================= ALERT =================

        if (txn.isSuspicious()) {

            Alert alert = new Alert();
            alert.setAlertMessage(reasons.toString());
            alert.setSeverity(severity);
            alert.setResolved(false);
            alert.setTransactionId(txn.getId());

            alertRepository.save(alert);

            // EMAIL SAFE
            try {
                if (emailService != null) {
                    emailService.sendEmail(
                            "fraudadmin@gmail.com",
                            "🚨 Fraud Alert - " + severity,
                            "Amount: ₹" + txn.getAmount()
                    );
                }
            } catch (Exception e) {
                System.out.println("⚠️ Email failed");
            }
        }

        return txn;
    }

    public Iterable<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
