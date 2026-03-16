package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.enums.UserRole;
import com.example.ecommerce.service.AdminService;
import com.example.ecommerce.service.ProductService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;  // <-- ADD THIS IMPORT

import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.WalletService;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final WalletService WalletService;
    private final UserRepository UserRepository;

    @PutMapping("/approve-seller/{id}")
    public void approveSeller(@PathVariable Long id) {
        adminService.approveSeller(id);
    }

    @PutMapping("/reject-seller/{id}")
    public void rejectSeller(@PathVariable Long id) {
        adminService.rejectSeller(id);
    }

    @PutMapping("/approve-product/{id}")
    public void approveProduct(@PathVariable Long id) {
        adminService.approveProduct(id);
    }

    @PutMapping("/reject-product/{id}")
    public void rejectProduct(@PathVariable Long id) {
        adminService.rejectProduct(id);
    }

    @GetMapping("/products/all")
    public List<ProductResponse> getAllProductsForAdmin() {
        return productService.getAllProductsForAdmin();
    }

    @GetMapping("/products/pending")
    public List<ProductResponse> getPendingProducts() {
        return productService.getAllProductsForAdmin().stream()
                .filter(p -> "PENDING".equals(p.getVerificationStatus()))
                .collect(Collectors.toList());
    }
   @GetMapping("/revenue")
    public Map<String, Double> getPlatformRevenue() {
        // Get first admin user (assuming at least one exists)
        Long adminId = UserRepository.findUsersByRole(UserRole.ADMIN)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No admin user found"))
                .getId();

        double revenue = WalletService.getBalance(adminId);  // <-- now using instance method
        return Map.of("revenue", revenue);
    }
}