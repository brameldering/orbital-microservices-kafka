package com.orbital.inventory.data.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

import java.util.Set;
import java.util.HashSet;

// import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name="api_access")
@Data
@ToString
public class ApiAccess {
  @Id
  @Column(name="api_name")
  private String apiName;

  @Column(name="microservice")
  private String microservice;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "api_access_role",
      joinColumns = @JoinColumn(name = "api_name"),
      inverseJoinColumns = @JoinColumn(name = "role")
  )
  @JsonManagedReference // To avoid circular dependencies
  private Set<Role> allowedRoles = new HashSet<>();
}
