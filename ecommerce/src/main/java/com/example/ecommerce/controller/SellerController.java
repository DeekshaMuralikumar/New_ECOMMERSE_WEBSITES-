package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;

    @GetMapping("/{sellerId}/products")
    public List<ProductResponse> products(@PathVariable Long sellerId) {
        return sellerService.getSellerProducts(sellerId);
    }

    @GetMapping("/{sellerId}/low-stock")
    public List<ProductResponse> lowStock(@PathVariable Long sellerId) {
        return sellerService.getLowStockProducts(sellerId);
    }
}