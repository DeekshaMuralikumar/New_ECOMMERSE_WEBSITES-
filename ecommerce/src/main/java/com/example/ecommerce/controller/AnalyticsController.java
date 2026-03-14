package com.example.ecommerce.controller;

import com.example.ecommerce.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/revenue/today")
    public Double todayRevenue() {
        return analyticsService.getTodayRevenue();
    }

    @GetMapping("/product/{id}")
    public Map<String, Object> productSales(@PathVariable Long id) {
        return analyticsService.getProductSales(id);
    }

    @GetMapping("/seller/{id}")
    public Map<String, Object> sellerAnalytics(@PathVariable Long id) {
        return analyticsService.getSellerAnalytics(id);
    }
}