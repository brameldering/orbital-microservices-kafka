package com.orbital.inventory.DTO;

import com.orbital.inventory.data.entity.Product;
import com.orbital.inventory.data.entity.ProductQuantity;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
  @NotBlank(message = "Product ID cannot be empty")
	private String productId;

  @NotBlank(message = "Product name cannot be empty")
	private String name;
	private String brand;
	private String category;
	private Long quantity;

	public static ProductDTO fromEntity(Product product) {
		return new ProductDTO(
                  product.getProductId(),
                  product.getName(),
                  product.getBrand(),
                  product.getCategory(),
                  product.getProductQuantity() != null ? product.getProductQuantity().getQuantity() : 0
                );
	}

	public static Product toEntity(ProductDTO dto) {
		Product product = new Product();
		product.setProductId(dto.getProductId());
		product.setName(dto.getName());
		product.setBrand(dto.getBrand());
		product.setCategory(dto.getCategory());

		// Handle ProductQuantity if needed
		ProductQuantity pq = new ProductQuantity();
		pq.setQuantity(dto.getQuantity());
		pq.setProduct(product);
		product.setProductQuantity(pq);

		return product;
	}
}
