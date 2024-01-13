package com.orbital.inventory.data.repository;

import com.orbital.inventory.common.SerialStatus;
import com.orbital.inventory.data.entity.SerialNumber;
import com.orbital.inventory.data.entity.SerialNumberKey;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SerialNumberRepository extends JpaRepository<SerialNumber, SerialNumberKey>{
	List<SerialNumber> findByStatus(SerialStatus status);

}
