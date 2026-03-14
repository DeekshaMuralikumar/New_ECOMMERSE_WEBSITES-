package com.example.ecommerce.service.implementation;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.service.SellerService;

import java.util.List;

import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.model.Product;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final ProductRepository productRepository;

    @Override
    public List<ProductResponse> getSellerProducts(Long sellerId) {

        return productRepository.findAll()
                .stream()
                .filter(p -> p.getOwner().getId().equals(sellerId))
                .map(p -> ProductResponse.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .price(p.getPrice())
                        .availableQuantity(p.getAvailableQuantity())
                        .build())
                .toList();
    }

    @Override
    public List<ProductResponse> getLowStockProducts(Long sellerId) {

        return productRepository.findLowStockProducts()
                .stream()
                .filter(p -> p.getOwner().getId().equals(sellerId))
                .map(p -> ProductResponse.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .availableQuantity(p.getAvailableQuantity())
                        .build())
                .toList();
    }

    @Override
    public void updateInventory(Long productId, int quantity) {

        Product product = productRepository.findById(productId).orElseThrow();

        product.setAvailableQuantity(quantity);

        productRepository.save(product);
    }
}