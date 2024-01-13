package com.orbital.inventory.data.repository;

import com.orbital.inventory.data.entity.ProductQuantity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductQuantityRepository extends JpaRepository<ProductQuantity, String> {

}
