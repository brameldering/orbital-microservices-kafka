package com.orbital.inventory.data.entity;

import com.orbital.inventory.common.SerialStatus;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name="serial_number")
@Data
@ToString
public class SerialNumber {
	@EmbeddedId
	private SerialNumberKey id;
	// @Id
	// @Column(name="serial_number_id")
	// @GeneratedValue(strategy = GenerationType.AUTO)
	// private long id;

	// No need to define the following again because of SerialNumberKey
	// @Column(name="product_id")
	// private String productId;
	// @Column(name="serial_number")
	// private String serialNumber;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private SerialStatus status; // Status is an enum
}
