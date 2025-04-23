# Base image with JDK and Maven wrapper support
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven wrapper and settings
COPY mvnw .
COPY .mvn .mvn
RUN chmod +x mvnw

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Create a non-root user and switch to it
RUN adduser -D myuser

# Adjust permissions before switching users
RUN chown -R myuser:myuser /app

USER myuser

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=dev

# Expose the port your Spring Boot app runs on
EXPOSE 3000

# Health check (updated to use port 3000)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/actuator/health || exit 1

# Run the Spring Boot application using Maven (supports devtools reload)
CMD ["./mvnw", "spring-boot:run"]
