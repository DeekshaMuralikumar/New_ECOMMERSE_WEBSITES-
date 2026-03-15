package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String verificationStatus;
    private String address;
}