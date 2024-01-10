package com.orbitelco.inventory.data.repository;

import com.orbitelco.inventory.common.SerialStatus;
import com.orbitelco.inventory.data.entity.SerialNumber;
import com.orbitelco.inventory.data.entity.SerialNumberKey;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SerialNumberRepository extends JpaRepository<SerialNumber, SerialNumberKey>{
	List<SerialNumber> findByStatus(SerialStatus status);

}
