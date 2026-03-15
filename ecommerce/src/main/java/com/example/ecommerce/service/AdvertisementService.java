package com.example.ecommerce.service;

public interface AdvertisementService {

    void enableAdvertisement(Long productId);

    void disableAdvertisement(Long productId);

    void recordAdClick(Long productId, Long userId);

    long getTotalClicks(Long productId);

    java.util.List<com.example.ecommerce.dto.response.ProductResponse> getActiveAdvertisements();

}
