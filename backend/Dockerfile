# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-17 AS build

# Workdir inside container
WORKDIR /app

# Copy backend module completely (pom + src + others)
COPY backend ./backend

# Go inside backend folder
WORKDIR /app/backend

# Build Spring Boot jar (tests skip for speed)
RUN mvn clean package -DskipTests

# ---------- Run stage ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy jar from build stage
# NOTE: Jar name EXACT ah backend/target la irukra jar name ah maathu
COPY --from=build /app/backend/target/Residents-0.0.1-SNAPSHOT.jar app.jar

# Render will give PORT env; pass it to Spring Boot
ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]



