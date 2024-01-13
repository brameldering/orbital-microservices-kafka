package com.orbital.inventory.data.repository;

import com.orbital.inventory.data.entity.Role;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
    Set<Role> findByRoleIn(Set<String> roleNames);
}
