package com.orbitelco.inventory.data.entity;

import com.orbitelco.inventory.data.common.SerialStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Table;
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
	@Column(name = "status")
	private SerialStatus status; // Status is an enum
}
