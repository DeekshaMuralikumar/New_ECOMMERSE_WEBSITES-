package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.service.AdvertisementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ads")
@RequiredArgsConstructor
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    @PostMapping("/enable/{productId}")
    public void enableAd(@PathVariable Long productId) {
        advertisementService.enableAdvertisement(productId);
    }

    @PostMapping("/disable/{productId}")
    public void disableAd(@PathVariable Long productId) {
        advertisementService.disableAdvertisement(productId);
    }

    @GetMapping("/clicks/{productId}")
    public long clicks(@PathVariable Long productId) {
        return advertisementService.getTotalClicks(productId);
    }

    @PostMapping("/click/{productId}")
    public void recordClick(@PathVariable Long productId, @RequestParam Long userId) {
        advertisementService.recordAdClick(productId, userId);
    }

    @GetMapping("/active")
    public List<ProductResponse> getActiveAds() {
        return advertisementService.getActiveAdvertisements();
    }
}