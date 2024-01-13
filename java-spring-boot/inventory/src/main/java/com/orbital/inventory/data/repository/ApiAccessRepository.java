package com.orbital.inventory.data.repository;

import com.orbital.inventory.data.entity.ApiAccess;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiAccessRepository extends JpaRepository<ApiAccess, String> {

}
