package com.orbital.inventory.controller;

// import com.orbital.inventory.data.entity.ProductQuantity;
// import com.orbital.inventory.data.repository.ProductQuantityRepository;
// import com.orbital.inventory.exception.BadRequestException;

// import com.orbital.inventory.web.exception.NotFoundException;
// import org.springframework.http.HttpStatus;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.ResponseStatus;
// import org.springframework.web.bind.annotation.RestController;

// import java.util.List;
// import java.util.Optional;

public class ProductQuantityApiController {
}

// @RestController
// @RequestMapping("/api/inventory/v2/quantity")
// public class ProductQuantityApiController {

//   private final ProductQuantityRepository productQuantityRepository;

//   public ProductQuantityApiController(ProductQuantityRepository productQuantityRepository) {
//     this.productQuantityRepository = productQuantityRepository;
//   }
  /* get-quantity */
  // @GetMapping
  // public List<ProductQuantity> getAllProductQuantities(){
  //   return this.productQuantityRepository.findAll();
  // }

  /* create-quantity */
  // @PostMapping
  // @ResponseStatus(HttpStatus.CREATED)
  // public ProductQuantity addProductQuantity(@RequestBody ProductQuantity productQuantity){
  //   return this.productQuantityRepository.save(productQuantity);
  // }

  /* get-quantity-by-product-and-location */
  // @GetMapping("/{productId}/{locationId}")
  // public ProductQuantity getProductQuantity(@PathVariable("id")String id){
  //   Optional<ProductQuantity> productQuantity = this.productQuantityRepository.findById(id);
  //   if (productQuantity.isEmpty()){
  //     throw new NotFoundException("productQuantity not found with id: " + id);
  //   }
  //   return productQuantity.get();
  // }

  /* update-quantity-by-product-and-location */
  // @PutMapping("/{productId}/{locationId}")
  // public ProductQuantity updateProductQuantity(@PathVariable("id")String id, @RequestBody ProductQuantity productQuantity){
  //  if (id != productQuantity.getProductId()){
  //    throw new BadRequestException("id on path must match body");
  //  }
  //  return productQuantityRepository.save(productQuantity);
  // }
// }