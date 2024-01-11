# Step 1: Use Maven base image to build the project
FROM maven:3.8.5-openjdk-17 as build

# Copy the project files to the container
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app

# Set the working directory
WORKDIR /usr/src/app

# Build the application
RUN mvn clean package -DskipTests

# Step 2: Use OpenJDK base image to run the application
FROM openjdk:17-jdk-slim

# Copy the built artifact from the build stage
COPY --from=build /usr/src/app/target/inventory-0.0.1-SNAPSHOT.jar /usr/app/inventory.jar

# Set the working directory
WORKDIR /usr/app

# Expose the port the application runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-Dspring.profiles.active=dev", "-jar", "inventory.jar"]

