package com.orbital.inventory.DTO;

import com.orbital.inventory.common.SerialStatus;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SerialNumberDTO {
  @NotBlank(message = "Product ID cannot be empty")
  private String productId;
  @NotBlank(message = "Serialnumber cannot be empty")
  private String serialNumber;
  private SerialStatus status;
}
