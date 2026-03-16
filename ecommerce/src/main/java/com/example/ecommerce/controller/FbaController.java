package com.example.ecommerce.controller;

// package com.example.backend.controller;

import com.example.ecommerce.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/fba")
@RequiredArgsConstructor
public class FbaController {
    private final WalletService walletService;

    @PostMapping("/pay-storage/{userId}")
    public Map<String, String> payStorageFee(@PathVariable Long userId, @RequestBody Map<String, Double> request) {
        double amount = request.get("amount");
        walletService.payStorageFee(userId, amount);
        return Map.of("message", "Payment successful");
    }
}
