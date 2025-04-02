package com.orbital.inventory.DTO;


import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InventoryMessageDTO {
  @NotBlank(message = "Product ID cannot be empty")
  private String productId;

  @NotNull(message = "Quantity cannot be null")
  private Long quantity;
}

