package com.orbital.inventory.data.repository;

import com.orbital.inventory.data.entity.ApiAccessRole;
import com.orbital.inventory.data.entity.ApiAccessRoleKey;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface ApiAccessRoleRepository extends JpaRepository<ApiAccessRole, ApiAccessRoleKey> {
  @Transactional
  void deleteById_ApiName(String apiName);;

  long countById_ApiName(String apiName);
}