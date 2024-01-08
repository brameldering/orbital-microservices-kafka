package com.orbitelco.inventory.data.repository;

import com.orbitelco.inventory.data.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, String> {

}
