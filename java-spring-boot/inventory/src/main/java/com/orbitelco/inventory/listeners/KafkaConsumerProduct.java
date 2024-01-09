package com.orbitelco.inventory.listeners;

import com.orbitelco.inventory.config.Constants;
import com.orbitelco.inventory.data.DTO.ProductDTO;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerProduct {

    @KafkaListener(topics = {Constants.TOPIC_PRODUCT_CREATED, Constants.TOPIC_PRODUCT_UPDATED, Constants.TOPIC_PRODUCT_DELETED}, groupId = Constants.GROUP_JSON,
            containerFactory = "productDTOKafkaListenerFactory")
    public void consumeJson(ProductDTO productDTO) {
        System.out.println("Consumed JSON Message: " + productDTO);
    }
}
