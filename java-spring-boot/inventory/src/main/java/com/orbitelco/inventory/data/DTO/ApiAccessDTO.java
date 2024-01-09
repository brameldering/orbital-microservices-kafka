package com.orbitelco.inventory.data.DTO;

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
    private String microservice;
    private String apiName;
    private String[] allowedRoles;
}
