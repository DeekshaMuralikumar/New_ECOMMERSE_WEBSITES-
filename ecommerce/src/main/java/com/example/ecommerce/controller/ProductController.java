package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.ProductRequest;
import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ProductResponse createProduct(@RequestBody ProductRequest request,
                                         @RequestParam Long ownerId) {
        return productService.createProduct(request, ownerId);
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(@PathVariable Long id,
                                         @RequestBody ProductRequest request) {
        return productService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @GetMapping
    public List<ProductResponse> getProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/category/{id}")
    public List<ProductResponse> getByCategory(@PathVariable Long id) {
        return productService.getProductsByCategory(id);
    }

    @GetMapping("/low-stock")
    public List<ProductResponse> lowStock() {
        return productService.getLowStockProducts();
    }
}