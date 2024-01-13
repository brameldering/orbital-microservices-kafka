package com.orbital.inventory.DTO;

import com.orbital.inventory.data.entity.ApiAccess;
import com.orbital.inventory.data.entity.Role;
import com.orbital.inventory.data.repository.RoleRepository;

import lombok.AllArgsConstructor;
import lombok.ToString;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ApiAccessDTO {
  private String apiName;
  private String microservice;
  private Set<String>  allowedRoles;

  @Transactional
  public static ApiAccessDTO fromEntity(ApiAccess apiAccess) {
    Set<String> roleNames = apiAccess.getAllowedRoles().stream()
                              .map(Role::getRole)
                              .collect(Collectors.toSet());
    return new ApiAccessDTO(apiAccess.getApiName(), apiAccess.getMicroservice(),
                      roleNames);
}

  @Transactional
	public static ApiAccess toEntity(ApiAccessDTO dto, RoleRepository roleRepository) {
		ApiAccess apiAccess = new ApiAccess();
		apiAccess.setApiName(dto.getApiName());
		apiAccess.setMicroservice(dto.getMicroservice());

    // Fetch role entities from the database
    Set<Role> roles = roleRepository.findByRoleIn(dto.getAllowedRoles());
    System.out.println("ApiAccessDTO Fetched roles: " + roles);

    apiAccess.setAllowedRoles((roles));

		return apiAccess;
	}
}
