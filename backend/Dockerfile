FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /build

# We are already INSIDE backend context, so just pom.xml + src
COPY pom.xml .
COPY src ./src

RUN mvn -B package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

# change JAR name if different
COPY --from=build /build/target/Residents-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
