package com.example.ecommerce.service;

import java.util.Map;

public interface AnalyticsService {

    Double getTodayRevenue();

    Map<String, Object> getProductSales(Long productId);

    Map<String, Object> getSellerAnalytics(Long sellerId);

}
