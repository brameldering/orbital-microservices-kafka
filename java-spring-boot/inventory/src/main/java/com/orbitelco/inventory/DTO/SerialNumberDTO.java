package com.orbitelco.inventory.DTO;

import com.orbitelco.inventory.common.SerialStatus;

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
