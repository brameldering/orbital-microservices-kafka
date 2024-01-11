package com.orbitelco.inventory.DTO;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ApiAccessDTO {
    private String apiName;
    private String microservice;
    private String[] allowedRoles;
}
