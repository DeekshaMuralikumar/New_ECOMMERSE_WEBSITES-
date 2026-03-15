package com.example.ecommerce.service.impl;

import com.example.ecommerce.dto.request.ProductRequest;
import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.entity.Category;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.enums.ProductStatus;
import com.example.ecommerce.enums.UserRole;
import com.example.ecommerce.enums.VerificationStatus;
import com.example.ecommerce.repository.AdvertisementRepository;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final AdvertisementRepository advertisementRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request, Long ownerId) {
        User owner = userRepository.findById(ownerId).orElseThrow();

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }
        if (category == null) {
            category = categoryRepository.findByNameIgnoreCase("General")
                    .orElseGet(() -> categoryRepository.save(Category.builder().name("General").build()));
        }

        if (owner.getRole() == UserRole.FBA_MERCHANT && request.getWeight() == null) {
            throw new IllegalArgumentException("Weight is required for FBA products");
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .image(request.getImage())
                .price(request.getPrice())
                .availableQuantity(request.getAvailableQuantity())
                .weight(request.getWeight() != null ? request.getWeight() : 0.0)
                .minThreshold(request.getMinThreshold() != null ? request.getMinThreshold() : 5)
                .category(category)
                .owner(owner)
                .status(ProductStatus.ACTIVE)
                .verificationStatus(VerificationStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        productRepository.save(product);
        return mapToResponse(product);
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
        return productRepository.findActiveApprovedProducts().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findProductsByCategory(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product p = productRepository.findById(id).orElseThrow();
        return mapToResponse(p);
    }

    @Override
    public List<ProductResponse> getProductsByOwner(Long ownerId) {
        return productRepository.findAll().stream()
                .filter(p -> p.getOwner() != null && p.getOwner().getId().equals(ownerId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .availableQuantity(product.getAvailableQuantity())
                .image(product.getImage())
                .status(product.getStatus() != null ? product.getStatus().name() : null)
                .verificationStatus(product.getVerificationStatus() != null ? product.getVerificationStatus().name() : null)
                .category(product.getCategory() != null ? product.getCategory().getName() : "General")
                .ownerId(product.getOwner() != null ? product.getOwner().getId() : null)
                .weight(product.getWeight())
                .isAdvertised(advertisementRepository.findAdsByProduct(product.getId()).stream().anyMatch(ad -> ad.isEnabled()))
                .build();
    }
  @Override
public List<ProductResponse> getAllProductsForAdmin() {
    return productRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}
}