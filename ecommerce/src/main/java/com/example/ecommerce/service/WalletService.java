package com.example.ecommerce.service;

// package com.example.backend.service;

import com.example.ecommerce.entity.Transaction;

import java.util.List;

public interface WalletService {

    void creditWallet(Long userId, double amount);

    void debitWallet(Long userId, double amount);

    double getBalance(Long userId);

    List<Transaction> getTransactions(Long userId);
    void payStorageFee(Long fbaUserId, double amount);
}
