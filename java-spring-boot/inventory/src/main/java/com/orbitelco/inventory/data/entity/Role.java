package com.orbitelco.inventory.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

import java.util.Set;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name="role")
@Data
@ToString
public class Role {
  @Id
  @Column(name="role")
  private String role;

  @Column(name="role_display")
  private String roleDisplay;

  @ManyToMany(mappedBy = "allowedRoles")
  @JsonBackReference // To avoid circular dependency
  private Set<ApiAccess> apiAccesses = new HashSet<>();
}
