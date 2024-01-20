package com.orbital.inventory.publishers;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orbital.inventory.DTO.InventoryMessageDTO;
import com.orbital.inventory.common.Constants;

@Service
public class InventoryPublisherService {

  private final KafkaTemplate<String, String> kafkaTemplate;

  public InventoryPublisherService(KafkaTemplate<String, String> kafkaTemplate) {
      this.kafkaTemplate = kafkaTemplate;
  }

  public void publishInventoryUpdate(String key, String productId, long quantity) {
    String message = constructMessage(productId, quantity);
    System.out.println("publishInventoryUpdate published message on topic " + Constants.TOPIC_INVENTORY_UPDATED +
    " message: "+ message);
    kafkaTemplate.send(Constants.TOPIC_INVENTORY_UPDATED, key, message);
  }

  private String constructMessage(String productId, long quantity) {
    InventoryMessageDTO messageObj = new InventoryMessageDTO(productId, quantity);
    ObjectMapper mapper = new ObjectMapper();

    try {
      return mapper.writeValueAsString(messageObj);
    } catch (JsonProcessingException e) {
      // TO DO: handle and log the exception
      e.printStackTrace();
      return null;
    }
  }
}

