FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY . ./
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

COPY --from=build /build/target/*.jar bookapp-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "bookapp-0.0.1-SNAPSHOT.jar"]