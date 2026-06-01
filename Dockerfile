# ЭТАП 1: Сборка приложения
# Используем образ с Maven и Java 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Сначала копируем только файлы pom.xml для загрузки зависимостей
# Это ускоряет сборку, так как зависимости кэшируются
# COPY pom.xml .
# RUN mvn dependency:go-offline

# Копируем остальной исходный код и собираем проект
COPY . ./
RUN mvn clean package -DskipTests

# ЭТАП 2: Запуск приложения
# Используем легкий образ только с JRE (Java Runtime Environment)
FROM eclipse-temurin:21-jre-alpine
# WORKDIR /app

# Копируем готовый jar-файл из этапа сборки
# Замените 'my-app-0.0.1-SNAPSHOT.jar' на название вашего файла из папки target
COPY --from=build /build/target/*.jar bookapp-0.0.1-SNAPSHOT.jar

# Указываем порт, на котором работает Spring Boot (обычно 8080)
EXPOSE 8080

# Команда для запуска
ENTRYPOINT ["java", "-jar", "bookapp-0.0.1-SNAPSHOT.jar"]