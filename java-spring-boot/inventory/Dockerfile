# Build stage
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy pom.xml and source code
COPY pom.xml /usr/src/app/
COPY src /usr/src/app/src

# Resolve dependencies and build the application
RUN mvn -B dependency:resolve dependency:resolve-plugins
RUN mvn -B compile -DskipTests
RUN mvn -B package -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=warn

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /usr/app

# Create a non-root user and switch to it
RUN adduser -D myuser
USER myuser

# Copy the built JAR from the build stage
COPY --from=build /usr/src/app/target/inventory-0.0.1-SNAPSHOT.jar /usr/app/inventory.jar

# Expose the port the application runs on
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=dev

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Command to run the application
CMD ["java", "-jar", "inventory.jar"]
