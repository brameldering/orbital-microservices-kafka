package com.orbital.inventory.publishers;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orbital.inventory.DTO.InventoryMessageDTO;
import com.orbital.inventory.common.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class InventoryPublisherService {

  private static final Logger logger = LoggerFactory.getLogger(InventoryPublisherService.class);
  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ObjectMapper objectMapper;

    // Constructor Injection for dependencies (KafkaTemplate and ObjectMapper)
  public InventoryPublisherService(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
    this.kafkaTemplate = kafkaTemplate;
    this.objectMapper = objectMapper;
  }

  public void publishInventoryUpdate(String key, String productId, long quantity) {
    if (key == null || productId == null || quantity < 0) {
      logger.error("Invalid input data: key={}, productId={}, quantity={}", key, productId, quantity);
      return; // Exit early if invalid data
    }

    String message = constructMessage(productId, quantity);
    if (message != null) {
        logger.info("Publishing message to Kafka topic {}: {}", Constants.TOPIC_INVENTORY_UPDATED, message);
        kafkaTemplate.send(Constants.TOPIC_INVENTORY_UPDATED, key, message);
    } else {
        logger.error("Failed to serialize the message for productId={} and quantity={}", productId, quantity);
    }
  }

  private String constructMessage(String productId, long quantity) {
    InventoryMessageDTO messageObj = new InventoryMessageDTO(productId, quantity);

    try {
        return objectMapper.writeValueAsString(messageObj);
    } catch (JsonProcessingException e) {
        // Log the error with a more detailed message
        logger.error("Error while serializing InventoryMessageDTO for productId={} and quantity={}", productId, quantity, e);
        return null;
    }
  }
}

