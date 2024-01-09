package com.orbitelco.inventory.listeners;

import com.orbitelco.inventory.config.Constants;
import com.orbitelco.inventory.data.DTO.ApiAccessDTO;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerApiAccess {

    @KafkaListener(topics = {Constants.TOPIC_APIACCESS_CREATED, Constants.TOPIC_APIACCESS_UPDATED, Constants.TOPIC_APIACCESS_DELETED}, groupId = Constants.GROUP_JSON,
            containerFactory = "apiAccessDTOKafkaListenerFactory")
    public void consumeJson(ApiAccessDTO apiAccessDTO) {
        System.out.println("Consumed JSON Message: " + apiAccessDTO);
    }
}
