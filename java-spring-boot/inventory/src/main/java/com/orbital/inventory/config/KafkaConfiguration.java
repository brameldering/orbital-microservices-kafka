package com.orbital.inventory.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
// import org.springframework.kafka.core.KafkaTemplate;
// import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.core.ConsumerFactory;
// import org.springframework.kafka.core.DefaultKafkaProducerFactory;
// import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import com.orbital.inventory.DTO.ProductDTO;

// import org.springframework.util.backoff.FixedBackOff;

@EnableKafka
@Configuration
public class KafkaConfiguration {

// Spring Boot will automatically create a KafkaTemplate, ProducerFactory and ConsumerFactory
// using properties in application.properties.

  @Bean
  public ConcurrentKafkaListenerContainerFactory<String, ProductDTO> productDTOKafkaListenerFactory
              (ConsumerFactory<String, ProductDTO> productDTOConsumerFactory) {
      ConcurrentKafkaListenerContainerFactory<String, ProductDTO> factory = new ConcurrentKafkaListenerContainerFactory<>();
      factory.setConsumerFactory(productDTOConsumerFactory);
      // factory.setErrorHandler(new SeekToCurrentErrorHandler(new FixedBackOff(1000L, 3))); // retries 3 times
      return factory;
  }

    // @Bean
    // public KafkaTemplate<String, String> kafkaTemplate(ProducerFactory<String, String> producerFactory) {
    //     return new KafkaTemplate<>(producerFactory);
    // }

    // @Bean
    // public ProducerFactory<String, String> producerFactory() {
    //     Map<String, Object> config = new HashMap<>();
    //     config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, Constants.BOOTSTRAP_SERVERS_CONFIG);
    //     config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    //     config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
    //     config.put(ProducerConfig.ACKS_CONFIG, "all");
    //     config.put(ProducerConfig.RETRIES_CONFIG, 3);
    //     return new DefaultKafkaProducerFactory<>(config);
    // }

    // @Bean
    // public ConsumerFactory<String, ProductDTO> productDTOConsumerFactory() {
    //     Map<String, Object> config = new HashMap<>();

    //     config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, Constants.BOOTSTRAP_SERVERS_CONFIG);
    //     config.put(ConsumerConfig.GROUP_ID_CONFIG, Constants.GROUP_JSON);
    //     config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    //     config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
    //     config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest"); // Start from the earliest message if no offset is stored
    //     return new DefaultKafkaConsumerFactory<>(config, new StringDeserializer(),
    //             new JsonDeserializer<>(ProductDTO.class));
    // }

}
