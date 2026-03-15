package com.example.ecommerce.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.UserRepository;

import com.example.ecommerce.service.ProductService;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.Category;
import com.example.ecommerce.entity.User;

import com.example.ecommerce.enums.ProductStatus;
import com.example.ecommerce.enums.VerificationStatus;

import com.example.ecommerce.dto.request.ProductRequest;
import com.example.ecommerce.dto.response.ProductResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;

        @Override
        public ProductResponse createProduct(ProductRequest request, Long ownerId) {

                Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow();
                User owner = userRepository.findById(ownerId).orElseThrow();

                Product product = Product.builder()
                                .name(request.getName())
                                .description(request.getDescription())
                                .image(request.getImage())
                                .price(request.getPrice())
                                .availableQuantity(request.getAvailableQuantity())
                                .weight(request.getWeight())
                                .minThreshold(request.getMinThreshold())
                                .category(category)
                                .owner(owner)
                                .status(ProductStatus.ACTIVE)
                                .verificationStatus(VerificationStatus.PENDING)
                                .createdAt(LocalDateTime.now())
                                .build();

                productRepository.save(product);

                return ProductResponse.builder()
                                .id(product.getId())
                                .name(product.getName())
                                .price(product.getPrice())
                                .availableQuantity(product.getAvailableQuantity())
                                .status(product.getStatus().name())
                                .build();
        }

        @Override
        public ProductResponse updateProduct(Long productId, ProductRequest request) {

                Product product = productRepository.findById(productId).orElseThrow();

                product.setPrice(request.getPrice());
                product.setAvailableQuantity(request.getAvailableQuantity());

                productRepository.save(product);

                return ProductResponse.builder()
                                .id(product.getId())
                                .name(product.getName())
                                .price(product.getPrice())
                                .build();
        }

        @Override
        public void deleteProduct(Long productId) {
                productRepository.deleteById(productId);
        }

        @Override
        public List<ProductResponse> getAllProducts() {

                return productRepository.findActiveApprovedProducts()
                                .stream()
                                .map(p -> ProductResponse.builder()
                                                .id(p.getId())
                                                .name(p.getName())
                                                .price(p.getPrice())
                                                .availableQuantity(p.getAvailableQuantity())
                                                .build())
                                .toList();
        }

        @Override
        public List<ProductResponse> getProductsByCategory(Long categoryId) {

                return productRepository.findProductsByCategory(categoryId)
                                .stream()
                                .map(p -> ProductResponse.builder()
                                                .id(p.getId())
                                                .name(p.getName())
                                                .price(p.getPrice())
                                                .build())
                                .toList();
        }

        @Override
        public List<ProductResponse> getLowStockProducts() {

                return productRepository.findLowStockProducts()
                                .stream()
                                .map(p -> ProductResponse.builder()
                                                .id(p.getId())
                                                .name(p.getName())
                                                .availableQuantity(p.getAvailableQuantity())
                                                .build())
                                .toList();
        }
}