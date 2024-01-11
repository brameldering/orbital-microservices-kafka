package com.orbitelco.inventory.DTO;

import com.orbitelco.inventory.data.entity.Product;
import com.orbitelco.inventory.data.entity.ProductQuantity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
	private String productId;
	private String name;
	private String brand;
	private String category;
	private long quantity;

	public static ProductDTO fromEntity(Product product) {
		ProductQuantity pq = product.getProductQuantity();
		long quantity = pq != null ? pq.getQuantity() : 0;
		return new ProductDTO(product.getProductId(), product.getName(),
												product.getBrand(), product.getCategory(), quantity);
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
