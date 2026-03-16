package com.example.ecommerce.service.impl;

import com.example.ecommerce.entity.Transaction;
import com.example.ecommerce.entity.Wallet;
import com.example.ecommerce.repository.TransactionRepository;
import com.example.ecommerce.repository.WalletRepository;
import com.example.ecommerce.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public void creditWallet(Long userId, double amount) {
        Wallet wallet = walletRepository.findWalletByUser(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for user: " + userId));
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
        Wallet wallet = walletRepository.findWalletByUser(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for user: " + userId));
        if (wallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }
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
        return walletRepository.findWalletByUser(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"))
                .getBalance();
    }

    @Override
    public List<Transaction> getTransactions(Long userId) {
        Wallet wallet = walletRepository.findWalletByUser(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return transactionRepository.findTransactionsByWallet(wallet.getId());
    }

    @Override
    public void payStorageFee(Long fbaUserId, double amount) {
        // Debit FBA wallet
        Wallet fbaWallet = walletRepository.findWalletByUser(fbaUserId)
                .orElseThrow(() -> new RuntimeException("FBA wallet not found"));
        if (fbaWallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance to pay storage fee");
        }
        fbaWallet.setBalance(fbaWallet.getBalance() - amount);
        walletRepository.save(fbaWallet);
        transactionRepository.save(Transaction.builder()
                .wallet(fbaWallet)
                .amount(amount)
                .type("STORAGE_FEE_PAYMENT")
                .createdAt(LocalDateTime.now())
                .build());

        // Credit admin wallet
        Wallet adminWallet = walletRepository.findAdminWallet()
                .orElseThrow(() -> new RuntimeException("Admin wallet not found"));
        adminWallet.setBalance(adminWallet.getBalance() + amount);
        walletRepository.save(adminWallet);
        transactionRepository.save(Transaction.builder()
                .wallet(adminWallet)
                .amount(amount)
                .type("STORAGE_FEE_CREDIT")
                .createdAt(LocalDateTime.now())
                .build());
    }
}