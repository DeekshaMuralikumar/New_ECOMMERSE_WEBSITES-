package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.service.AdminService;
import com.example.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;  // <-- ADD THIS IMPORT

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;

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
}