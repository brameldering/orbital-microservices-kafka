package com.orbital.inventory.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class SerialNumberKey implements Serializable {
  @Column(name = "product_id", nullable = false, length = 80)
	private String productId;
  @Column(name = "serial_number", nullable = false, length = 100)
	private String serialNumber;

	// Constructor with fields
  public SerialNumberKey(String productId, String serialNumber) {
    if (productId == null || serialNumber == null || productId.isEmpty() || serialNumber.isEmpty()) {
        throw new IllegalArgumentException("productId and serialNumber cannot be null or empty");
    }
    this.productId = productId;
    this.serialNumber = serialNumber;
}

  // Lombok will generate the getters and setters, no need to manually define them

	// hashCode and equals implementations
	@Override
	public boolean equals(Object o) {
			if (this == o) return true;
			if (!(o instanceof SerialNumberKey)) return false;
			SerialNumberKey that = (SerialNumberKey) o;
			return Objects.equals(getProductId(), that.getProductId()) &&
							Objects.equals(getSerialNumber(), that.getSerialNumber());
	}

	@Override
	public int hashCode() {
			return Objects.hash(getProductId(), getSerialNumber());
	}

  @Override
  public String toString() {
      return "SerialNumberKey{" +
              "productId='" + productId + '\'' +
              ", serialNumber='" + serialNumber + '\'' +
              '}';
  }
}
