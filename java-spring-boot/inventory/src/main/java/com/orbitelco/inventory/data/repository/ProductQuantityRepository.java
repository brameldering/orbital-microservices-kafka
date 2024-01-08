package com.orbitelco.inventory.data.repository;

import com.orbitelco.inventory.data.entity.ProductQuantity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductQuantityRepository extends JpaRepository<ProductQuantity, String> {

}
