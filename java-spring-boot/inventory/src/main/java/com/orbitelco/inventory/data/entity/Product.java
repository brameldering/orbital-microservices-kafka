package com.orbitelco.inventory.data.entity;

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
  // @Column(name="product_quantity_id")
  // @GeneratedValue(strategy = GenerationType.AUTO)
  // private long id;
  @Column(name="product_id")
  private String productId;

  @Column(name="name")
  private String name;
  
  @Column(name="brand")
  private String brand;
  
  @Column(name="category")
  private String category;
  
  // Note that with CascadeTyoe.All when deleting a product also the product_quantity will be deleted
  @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @PrimaryKeyJoinColumn
  @JsonManagedReference // To avoid circular dependencies
  private ProductQuantity productQuantity;
}
