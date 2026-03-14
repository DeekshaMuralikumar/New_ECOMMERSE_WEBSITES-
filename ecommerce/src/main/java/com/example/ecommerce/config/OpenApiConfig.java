package com.example.ecommerce.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.*;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ecommerceAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce Order Management API")
                        .version("1.0")
                        .description("Backend APIs for the E-Commerce System"));
    }
}