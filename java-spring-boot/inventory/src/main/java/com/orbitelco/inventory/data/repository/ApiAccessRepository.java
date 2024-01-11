package com.orbitelco.inventory.data.repository;

import com.orbitelco.inventory.data.entity.ApiAccess;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiAccessRepository extends JpaRepository<ApiAccess, String> {

}
