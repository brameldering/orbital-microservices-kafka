package com.orbital.inventory.data.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

@Embeddable
@Data
@ToString
public class ApiAccessRoleKey implements Serializable {
  private String apiName;
  private String role;
}
