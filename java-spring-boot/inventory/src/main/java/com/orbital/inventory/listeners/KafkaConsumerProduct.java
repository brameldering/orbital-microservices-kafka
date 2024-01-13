package com.orbital.inventory.listeners;

import com.orbital.inventory.data.entity.Product;
import com.orbital.inventory.DTO.ProductDTO;
import com.orbital.inventory.common.Constants;
import com.orbital.inventory.data.repository.ProductRepository;

import java.util.Optional;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerProduct {

  private final ProductRepository productRepository;

  public KafkaConsumerProduct(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @KafkaListener(topics = {Constants.TOPIC_PRODUCT_CREATED, Constants.TOPIC_PRODUCT_UPDATED, Constants.TOPIC_PRODUCT_DELETED}, groupId = Constants.GROUP_JSON,
      containerFactory = "productDTOKafkaListenerFactory")
  public void consumeJson(ProductDTO productDTO,
          @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
    System.out.println("Consumed message: " + productDTO + " from topic " + topic );

    // New Product
    if (topic.equals(Constants.TOPIC_PRODUCT_CREATED)) {
      Product product = ProductDTO.toEntity(productDTO);
      Product savedProduct = this.productRepository.save(product);
      ProductDTO savedProductDTO = ProductDTO.fromEntity(savedProduct);
      System.out.println("Saved Product: " + savedProductDTO);

    // Updated product (not the quantity)
    } else if (topic.equals(Constants.TOPIC_PRODUCT_UPDATED)) {
    // Find the existing product
      Optional<Product> existingProductOpt = productRepository.findById(productDTO.getProductId());

      if (existingProductOpt.isPresent()) {
          Product existingProduct = existingProductOpt.get();

          // Update the existing product with new values from DTO
          existingProduct.setName(productDTO.getName());
          existingProduct.setBrand(productDTO.getBrand());
          existingProduct.setCategory(productDTO.getCategory());

          // Do not update the quantity

          // Save the updated product
          Product updatedProduct = productRepository.save(existingProduct);
          ProductDTO updatedProductDTO = ProductDTO.fromEntity(updatedProduct);
          System.out.println("Updated Product: " + updatedProductDTO);

      } else {
          System.out.println("Product not found with ID: " + productDTO.getProductId());
          // TO DO: Log
      }
    } else if (topic.equals(Constants.TOPIC_PRODUCT_DELETED)) {
        // Find the existing product
      Optional<Product> productOpt = productRepository.findById(productDTO.getProductId());

      if (productOpt.isPresent()) {
          // Delete the product
          productRepository.deleteById(productDTO.getProductId());
          System.out.println("Deleted Product with ID: " + productDTO.getProductId());
      } else {
          System.out.println("Product not found for deletion with ID: " + productDTO.getProductId());
          // TO DO: Log
      }
    }
  }

}
