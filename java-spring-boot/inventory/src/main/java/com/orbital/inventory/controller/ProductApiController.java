package com.orbital.inventory.controller;

import com.orbital.inventory.DTO.ProductDTO;
import com.orbital.inventory.data.entity.Product;
import com.orbital.inventory.data.entity.ProductQuantity;
import com.orbital.inventory.data.repository.ProductRepository;
import com.orbital.inventory.exception.BadRequestException;
import com.orbital.inventory.exception.NotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory/v2/products")
public class ProductApiController {

  private final ProductRepository productRepository;

  public ProductApiController(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  /* get-product-inventory */
  @GetMapping
  public List<ProductDTO> getAllProducts() {
    return this.productRepository.findAll().stream()
        .map(ProductDTO::fromEntity)
        .collect(Collectors.toList());
  }

  /* create-product-inventory */
  // @PostMapping
  // @ResponseStatus(HttpStatus.CREATED)
  // public ProductDTO addProduct(@RequestBody ProductDTO productDto){
  //   Product product = ProductDTO.toEntity(productDto);
  //   Product savedProduct = this.productRepository.save(product);
  //   return ProductDTO.fromEntity(savedProduct);
  // }

  /* get-product-inventory-by-id */
  @GetMapping("/{id}")
  public ProductDTO getProduct(@PathVariable("id")String id){
    Optional<Product> product = this.productRepository.findById(id);
    if (product.isEmpty()){
      throw new NotFoundException("Product not found with id: " + id);
    }
    return ProductDTO.fromEntity(product.get());
  }

  /* update-product-inventory */
  // Updates the quantity in the ProductQuantity entity (product_quantity table)
  // does not allow upding anything else on the product since that data is coming from the Product service
  @PutMapping("/{id}")
  public ProductDTO updateProduct(@PathVariable("id") String id, @RequestBody ProductDTO productDto) {
      if (!id.equals(productDto.getProductId())) {
          throw new BadRequestException("ID on path must match body");
      }

      // Find the existing product
      Optional<Product> existingProductOpt = productRepository.findById(id);
      if (existingProductOpt.isEmpty()) {
          throw new NotFoundException("Product not found with ID: " + id);
      }
      Product existingProduct = existingProductOpt.get();
      // Update quantity if it's provided in the DTO
      ProductQuantity existingQuantity = existingProduct.getProductQuantity();
      if (existingQuantity == null) {
          existingQuantity = new ProductQuantity();
          existingQuantity.setProduct(existingProduct);
      }
      existingQuantity.setQuantity(productDto.getQuantity());
      existingProduct.setProductQuantity(existingQuantity);

      // Save the updated product
      Product updatedProduct = productRepository.save(existingProduct);

      // Return the updated product as DTO
      return ProductDTO.fromEntity(updatedProduct);
  }

}
