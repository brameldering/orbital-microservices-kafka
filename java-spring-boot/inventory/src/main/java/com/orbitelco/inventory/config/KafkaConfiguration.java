package com.orbitelco.inventory.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import com.orbitelco.inventory.DTO.ApiAccessDTO;
import com.orbitelco.inventory.DTO.ProductDTO;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConfiguration {

    @Bean
    public ConsumerFactory<String, ApiAccessDTO> apiAccessDTOConsumerFactory() {
        Map<String, Object> config = new HashMap<>();

        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, Constants.BOOTSTRAP_SERVERS_CONFIG);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, Constants.GROUP_JSON);
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(config, new StringDeserializer(),
                new JsonDeserializer<>(ApiAccessDTO.class));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ApiAccessDTO> apiAccessDTOKafkaListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, ApiAccessDTO> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(apiAccessDTOConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, ProductDTO> productDTOConsumerFactory() {
        Map<String, Object> config = new HashMap<>();

        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, Constants.BOOTSTRAP_SERVERS_CONFIG);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, Constants.GROUP_JSON);
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(config, new StringDeserializer(),
                new JsonDeserializer<>(ProductDTO.class));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ProductDTO> productDTOKafkaListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, ProductDTO> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(productDTOConsumerFactory());
        return factory;
    }

}
