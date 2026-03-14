package com.example.ecommerce.service;

public interface AdvertisementService {

    void enableAdvertisement(Long productId);

    void disableAdvertisement(Long productId);

    void recordAdClick(Long productId, Long userId);

    long getTotalClicks(Long productId);

}
