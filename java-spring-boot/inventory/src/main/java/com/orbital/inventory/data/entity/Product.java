package com.orbital.inventory.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;
import lombok.Data;
import lombok.ToString;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name="product")
@Data
@ToString
public class Product {
  @Id
  @Column(name = "product_id", nullable = false, unique = true, length = 80)
  private String productId;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "brand", nullable = true, length = 80)
  private String brand;

  @Column(name = "category", nullable = false, length = 50)
  private String category;

  // Note that with CascadeTyoe.All when creating/deleting a product also the product_quantity will be created/deleted
  @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
  @PrimaryKeyJoinColumn
  @JsonManagedReference // To avoid circular dependencies
  private ProductQuantity productQuantity;
}
