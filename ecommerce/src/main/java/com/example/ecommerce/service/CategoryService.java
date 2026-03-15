package com.example.ecommerce.service;

import com.example.ecommerce.entity.Category;

import java.util.List;

public interface CategoryService {

    Category createCategory(Category category);

    List<Category> getAllCategories();

}