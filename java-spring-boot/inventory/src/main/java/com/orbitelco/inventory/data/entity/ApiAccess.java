package com.orbitelco.inventory.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

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

  @Column(name="allowed_roles")
  private String[] role;
}
