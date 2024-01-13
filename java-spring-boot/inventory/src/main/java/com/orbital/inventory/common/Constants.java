package com.orbital.inventory.common;

public final class Constants {
    public static final String BOOTSTRAP_SERVERS_CONFIG = "kafka-service-1.kafka.svc.cluster.local:9092";
    public static final String TOPIC_APIACCESS_CREATED = "apiaccess-created";
    public static final String TOPIC_APIACCESS_UPDATED = "apiaccess-updated";
    public static final String TOPIC_APIACCESS_DELETED = "apiaccess-deleted";
    public static final String TOPIC_PRODUCT_CREATED = "product-created";
    public static final String TOPIC_PRODUCT_UPDATED = "product-updated";
    public static final String TOPIC_PRODUCT_DELETED = "product-deleted";
    public static final String GROUP_JSON = "inventory";

    public static final String MICROSERVICE_INVENTORY = "inventory";

    private Constants() {
      // private constructor to prevent instantiation
  }
}
