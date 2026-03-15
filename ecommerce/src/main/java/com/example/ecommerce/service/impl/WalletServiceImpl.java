package com.example.ecommerce.service.impl;

// package com.example.backend.service.impl;

import com.example.ecommerce.entity.Transaction;
import com.example.ecommerce.entity.Wallet;
import com.example.ecommerce.repository.TransactionRepository;
import com.example.ecommerce.repository.WalletRepository;
import com.example.ecommerce.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public void creditWallet(Long userId, double amount) {
        Wallet wallet = walletRepository.findWalletByUser(userId).orElseThrow();
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);
        transactionRepository.save(Transaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type("CREDIT")
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Override
    public void debitWallet(Long userId, double amount) {
        Wallet wallet = walletRepository.findWalletByUser(userId).orElseThrow();
        if (wallet.getBalance() < amount) throw new RuntimeException("Insufficient balance");
        wallet.setBalance(wallet.getBalance() - amount);
        walletRepository.save(wallet);
        transactionRepository.save(Transaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type("DEBIT")
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Override
    public double getBalance(Long userId) {
        return walletRepository.findWalletByUser(userId).orElseThrow().getBalance();
    }

    @Override
    public List<Transaction> getTransactions(Long userId) {
        Wallet wallet = walletRepository.findWalletByUser(userId).orElseThrow();
        return transactionRepository.findTransactionsByWallet(wallet.getId());
    }
}
