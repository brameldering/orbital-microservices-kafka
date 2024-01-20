package com.orbital.inventory.DTO;

public class InventoryMessageDTO {
  private String productId;
  private long quantity;

  // Constructors, getters, and setters
  public InventoryMessageDTO(String productId, long quantity) {
      this.productId = productId;
      this.quantity = quantity;
  }

  public String getProductId() {
      return productId;
  }

  public void setProductId(String productId) {
      this.productId = productId;
  }

  public long getQuantity() {
      return quantity;
  }

  public void setQuantity(long quantity) {
      this.quantity = quantity;
  }
}

