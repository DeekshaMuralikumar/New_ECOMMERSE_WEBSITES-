package com.example.ecommerce.service.impl;

import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.entity.AdClick;
import com.example.ecommerce.entity.Advertisement;
import com.example.ecommerce.repository.AdClickRepository;
import com.example.ecommerce.repository.AdvertisementRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.AdvertisementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdvertisementServiceImpl implements AdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final ProductRepository productRepository;
    private final AdClickRepository adClickRepository;
    private final UserRepository userRepository;

    @Override
    public void enableAdvertisement(Long productId) {
        Advertisement ad = advertisementRepository.findAdsByProduct(productId)
                .stream().findFirst().orElse(Advertisement.builder()
                        .product(productRepository.findById(productId).orElseThrow())
                        .enabled(true)
                        .build());
        ad.setEnabled(true);
        advertisementRepository.save(ad);
    }

    @Override
    public void disableAdvertisement(Long productId) {
        advertisementRepository.findAdsByProduct(productId)
                .forEach(ad -> {
                    ad.setEnabled(false);
                    advertisementRepository.save(ad);
                });
    }

    @Override
    public void recordAdClick(Long productId, Long userId) {
        AdClick click = AdClick.builder()
                .product(productRepository.findById(productId).orElseThrow())
                .user(userRepository.findById(userId).orElseThrow())
                .timestamp(LocalDateTime.now())
                .build();
        adClickRepository.save(click);
    }

    @Override
    public long getTotalClicks(Long productId) {
        return adClickRepository.countClicksByProduct(productId);
    }

    @Override
    public List<ProductResponse> getActiveAdvertisements() {
        return advertisementRepository.findActiveAdvertisements().stream()
                .map(ad -> ProductResponse.builder()
                        .id(ad.getProduct().getId())
                        .name(ad.getProduct().getName())
                        .description(ad.getProduct().getDescription())
                        .price(ad.getProduct().getPrice())
                        .image(ad.getProduct().getImage())
                        .isAdvertised(true)
                        .build())
                .collect(Collectors.toList());
    }
}