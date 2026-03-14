package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.ProductRequest;
import com.example.ecommerce.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request, Long ownerId);

    ProductResponse updateProduct(Long productId, ProductRequest request);

    void deleteProduct(Long productId);

    List<ProductResponse> getAllProducts();

    List<ProductResponse> getProductsByCategory(Long categoryId);

    List<ProductResponse> getLowStockProducts();

}