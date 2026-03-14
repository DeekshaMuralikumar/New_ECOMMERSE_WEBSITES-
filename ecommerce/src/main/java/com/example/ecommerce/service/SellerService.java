package com.example.ecommerce.service;


import com.example.ecommerce.dto.response.ProductResponse;

import java.util.List;

public interface SellerService {

    List<ProductResponse> getSellerProducts(Long sellerId);

    List<ProductResponse> getLowStockProducts(Long sellerId);

    void updateInventory(Long productId, int quantity);

}
