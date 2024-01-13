package com.orbital.inventory.DTO;

import com.orbital.inventory.common.SerialStatus;

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
  private String productId;
  private String serialNumber;
  private SerialStatus status;
}
