package com.example.ecommerce.service.impl;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.OrderItemRepository;
import com.example.ecommerce.service.AnalyticsService;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public Double getTodayRevenue() {
        return orderRepository.getTodayRevenue();
    }

    @Override
    public Map<String, Object> getProductSales(Long productId) {

        Integer totalSold = orderItemRepository.getTotalQuantitySold(productId);

        Map<String, Object> data = new HashMap<>();
        data.put("productId", productId);
        data.put("totalSold", totalSold);

        return data;
    }

    @Override
    public Map<String, Object> getSellerAnalytics(Long sellerId) {

        Map<String, Object> data = new HashMap<>();

        data.put("sellerId", sellerId);
        data.put("revenueToday", orderRepository.getTodayRevenue());

        return data;
    }
}