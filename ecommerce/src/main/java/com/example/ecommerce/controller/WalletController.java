package com.example.ecommerce.controller;

// package com.example.backend.controller;

import com.example.ecommerce.entity.Transaction;
import com.example.ecommerce.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/balance/{userId}")
    public double balance(@PathVariable Long userId) {
        return walletService.getBalance(userId);
    }

    @GetMapping("/transactions/{userId}")
    public List<Transaction> transactions(@PathVariable Long userId) {
        return walletService.getTransactions(userId);
    }
}
