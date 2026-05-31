# Bookapp - frontend

75381- Oleksandr Mandziuk 

# Bookapp - backend

75626 - Tymofii Salashnik

Wymagania:
* java 21
* maven
* PostgreSQL

Uruchamianie aplikacji:

```
mvn spring-boot:run
```

albo
```
mvn package
java -jar ./target/bookapp-0.0.1-SNAPSHOT.jar
```

## API:

### Autorzy:

* Lista wszystkich autorów: GET /author/
* Odczyt konkretnego autora: GET /author/{id}, gdzie {id} to identyfikator autora
* Utworzenie/aktualizacja autora: POST /author/save  z treścią żądania w formacie (jeśli pole id nie jest podane w JSON-ie, zostanie utworzony nowy autor; jeśli jest podane, istniejący autor zostanie zaktualizowany)
```
{
    "id": 2,
    "name": "Author Name",
    "biography": "Some interesting facts"
}
```
* Usunięcie autora: DELETE /author/{id}, gdzie {id} to identyfikator autora

### Książki:

* Lista wszystkich książek: GET /book/
* Lista wszystkich książek danego autora : GET /book/?authorId={id} gdzie {id} to identyfikator autora
* Odczyt konkretnej książki: GET /book/{id}, gdzie {id} to identyfikator książki
* Utworzenie/aktualizacja książki: POST /book/save z treścią żądania w formacie (jeśli pole id nie jest podane w JSON-ie, zostanie utworzona nowa książka; jeśli jest podane, istniejąca książka zostanie zaktualizowana)
```
{
	"rating": 10,
	"name": "Very Interesting Book!",
	"bookYear": 2020,
	"authors":[{"id":1}]
}
```
* Usunięcie książki: DELETE /book/{id},gdzie {id} to identyfikator książki

### Recenzje książek:

* Lista wszystkich recenzji dla określonej książki : GET /book-review/?bookId={id} gdzie {id} to identyfikator książki
* Odczyt konkretnej recenzji: GET /book-review/{id}, gdzie {id} to identyfikator recenzji
* Utworzenie/aktualizacja recenzji: POST /book-review/save z treścią żądania w formacie (jeśli pole id nie jest podane w JSON-ie, zostanie utworzona nowa recenzja; jeśli jest podane, istniejąca recenzja zostanie zaktualizowana)
```
{
	"book": {"id": 2},
	"userName": "VeryCleverUser",
	"grade": 10,
	"reviewText": "The best book in the world"
}
```
*  Usunięcie recenzji: DELETE /book-review/{id}, gdzie {id} to identyfikator recenzji
