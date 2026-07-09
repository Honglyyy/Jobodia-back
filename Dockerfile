# Frontend Build Stage
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Backend Build Stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Download dependencies
RUN ./mvnw dependency:go-offline
# Copy source code
COPY src ./src
# Copy built frontend assets into Spring Boot's static resources directory
COPY --from=frontend-build /frontend/dist/ ./src/main/resources/static/
# Build project
RUN ./mvnw clean package -DskipTests

# Run Stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
