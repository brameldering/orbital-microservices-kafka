package com.orbital.inventory.data.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name="api_access_role")
@Data
@ToString
public class ApiAccessRole {

  @EmbeddedId
  private ApiAccessRoleKey id;

  @ManyToOne(fetch = FetchType.EAGER)
  @MapsId("apiName") // This corresponds to the name of the attribute in ApiAccessRoleKey
  @JoinColumn(name = "api_name") // This is the column name in the join table
  private ApiAccess apiAccess;

  @ManyToOne(fetch = FetchType.EAGER)
  @MapsId("role") // This corresponds to the name of the attribute in ApiAccessRoleKey
  @JoinColumn(name = "role") // This is the column name in the join table
  private Role role;
}
