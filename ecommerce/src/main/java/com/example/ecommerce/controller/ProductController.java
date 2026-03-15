package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.ProductRequest;
import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/{id}")
    public ProductResponse getProduct(@PathVariable Long id) {
        return productService.getProductById(id);
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

  @GetMapping("/owner/{ownerId}")
public List<ProductResponse> getByOwner(@PathVariable Long ownerId) {
    return productService.getProductsByOwner(ownerId);
}
@GetMapping("/admin/all")
public List<ProductResponse> getAllProductsForAdmin() {
    return productService.getAllProductsForAdmin();
}

@GetMapping("/admin/products/pending")
public List<ProductResponse> getPendingProducts() {
    return productService.getAllProducts().stream()
        .filter(p -> "PENDING".equals(p.getVerificationStatus()))
        .collect(Collectors.toList());
}

}