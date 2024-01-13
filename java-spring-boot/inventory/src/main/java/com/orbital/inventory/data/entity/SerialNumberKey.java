package com.orbital.inventory.data.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class SerialNumberKey implements Serializable {
	private String productId;
	private String serialNumber;

	// Default constructor
	public SerialNumberKey() {}

	// Constructor with fields
	public SerialNumberKey(String productId, String serialNumber) {
			this.productId = productId;
			this.serialNumber = serialNumber;
	}

	// Getters and setters
	public String getProductId() {
			return productId;
	}

	public void setProductId(String productId) {
			this.productId = productId;
	}

	public String getSerialNumber() {
			return serialNumber;
	}

	public void setSerialNumber(String serialNumber) {
			this.serialNumber = serialNumber;
	}

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
}
