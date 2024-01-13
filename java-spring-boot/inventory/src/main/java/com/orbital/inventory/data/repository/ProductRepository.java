package com.orbital.inventory.data.repository;

import com.orbital.inventory.data.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, String> {

}
