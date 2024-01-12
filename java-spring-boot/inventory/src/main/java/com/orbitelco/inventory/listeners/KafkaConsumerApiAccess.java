package com.orbitelco.inventory.listeners;

import com.orbitelco.inventory.data.entity.ApiAccess;
import com.orbitelco.inventory.DTO.ApiAccessDTO;
import com.orbitelco.inventory.common.Constants;
import com.orbitelco.inventory.data.repository.ApiAccessRepository;
import com.orbitelco.inventory.data.repository.RoleRepository;

import jakarta.persistence.EntityManager;

import com.orbitelco.inventory.data.repository.ApiAccessRoleRepository;

import java.util.HashSet;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class KafkaConsumerApiAccess {

  private final ApiAccessRepository apiAccessRepository;
  private final RoleRepository roleRepository;
  private final ApiAccessRoleRepository apiAccessRoleRepository;

  @Autowired
  private EntityManager entityManager;


  public KafkaConsumerApiAccess(ApiAccessRepository apiAccessRepository, RoleRepository roleRepository,
        ApiAccessRoleRepository apiAccessRoleRepository) {
    this.apiAccessRepository = apiAccessRepository;
    this.roleRepository = roleRepository;
    this.apiAccessRoleRepository = apiAccessRoleRepository;
  }

  @Transactional
  @KafkaListener(topics = {Constants.TOPIC_APIACCESS_CREATED, Constants.TOPIC_APIACCESS_UPDATED, Constants.TOPIC_APIACCESS_DELETED}, groupId = Constants.GROUP_JSON,
          containerFactory = "apiAccessDTOKafkaListenerFactory")
  public void consumeJson(ApiAccessDTO apiAccessDTO,
          @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
    System.out.println("Consumed message: " + apiAccessDTO + " from topic " + topic );

    if (apiAccessDTO.getMicroservice().equals(Constants.MICROSERVICE_INVENTORY)) {
      // New ApiAccess
      if (topic.equals(Constants.TOPIC_APIACCESS_CREATED)) {
        ApiAccess apiAccess = ApiAccessDTO.toEntity(apiAccessDTO, roleRepository);

        ApiAccess savedApiAccess = this.apiAccessRepository.save(apiAccess);
        ApiAccessDTO savedApiAccessDTO = ApiAccessDTO.fromEntity(savedApiAccess);
        System.out.println("Saved ApiAccess: " + savedApiAccessDTO);

      // Updated apiAccess (not the quantity)
      } else if (topic.equals(Constants.TOPIC_APIACCESS_UPDATED)) {
      // Find the existing apiAccess
        Optional<ApiAccess> existingApiAccessOpt = apiAccessRepository.findById(apiAccessDTO.getApiName());

        if (existingApiAccessOpt.isPresent()) {
          ApiAccess existingApiAccess = existingApiAccessOpt.get();

          // Delete existing allowed roles for this apiAccess
          apiAccessRoleRepository.deleteById_ApiName(apiAccessDTO.getApiName());
          entityManager.flush();
          entityManager.clear();

          // Update the existing apiAccess with new values from DTO
          existingApiAccess.setMicroservice(apiAccessDTO.getMicroservice());
          existingApiAccess.setAllowedRoles(roleRepository.findByRoleIn(apiAccessDTO.getAllowedRoles()));

          // Save the updated apiAccess
          ApiAccess updatedApiAccess = apiAccessRepository.save(existingApiAccess);
          ApiAccessDTO updatedApiAccessDTO = ApiAccessDTO.fromEntity(updatedApiAccess);
          System.out.println("Updated ApiAccess: " + updatedApiAccessDTO);

        } else {
        System.out.println("ApiAccess not found with ID: " + apiAccessDTO.getApiName());
        // TO DO: Log
        }
      } else if (topic.equals(Constants.TOPIC_APIACCESS_DELETED)) {
      // Find the existing apiAccess
        Optional<ApiAccess> apiAccessOpt = apiAccessRepository.findById(apiAccessDTO.getApiName());

        if (apiAccessOpt.isPresent()) {
          // Delete existing allowed roles for this apiAccess
          apiAccessRoleRepository.deleteById_ApiName(apiAccessDTO.getApiName());
          entityManager.flush();
          entityManager.clear();

          // Delete the apiAccess
          apiAccessRepository.deleteById(apiAccessDTO.getApiName());
          System.out.println("Deleted ApiAccess with ID: " + apiAccessDTO.getApiName());
        } else {
        System.out.println("ApiAccess not found for deletion with ID: " + apiAccessDTO.getApiName());
        // TO DO: Log
        }
      }
    }
  }
}
