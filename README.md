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

### Zdjęcia autorów

* Dodanie zdjęcia autora: POST /author/{id}/photo, gdzie {id} to identyfikator autora. Plik jest przenoszony do pola file multipart-body
* Otrzymanie zdjęcia autora: GET /author/{id}/photo, gdzie {id} to identyfikator autora
* Usunięcie zdjęcia autora: DELETE /author/{id}/photo, gdzie {id} to identyfikator autora

### Kategorii:

* Lista wszystkich kategorii: GET /categories/
* Odczyt konkretnej kategorii: GET /category/{id}, gdzie {id} to identyfikator kategorii
* Utworzenie/aktualizacja kategorii: POST /category/save  z treścią żądania w formacie (jeśli pole id nie jest podane w JSON-ie, zostanie utworzony nowa kategoria; jeśli jest podana, istniejąca kategoria zostanie zaktualizowana)
```
{
    "id": 2,
    "name": "Kategoria 1",
}
```
* Usunięcie kategorii: DELETE /category/{id}, gdzie {id} to identyfikator kategorii

### Książki:

* Lista książek: GET /book/
  *  parametr żądania authorId  - filtr według id autora, napryzklad: GET /book/?authorId={id} gdzie {id} to identyfikator autora
  * parametr żądania categoryId -  filtr według id kategorii, napryzklad: GET /book/?categoryId={id} gdzie {id} to identyfikator kategorii
  * parametr żądania name - filtr według wpisu в nazwie książki(без учета регистра), napryzklad: GET /book/?name={n} gdzie {n} to część nazwy książki  
  * Wszystki parametry mogą być używane jednocześnie, napryzklad GET /book/?categoryId={bookId}&categoryId={categoryId}&name={name}}
* Odczyt konkretnej książki: GET /book/{id}, gdzie {id} to identyfikator książki
* Utworzenie/aktualizacja książki: POST /book/save z treścią żądania w formacie (jeśli pole id nie jest podane w JSON-ie, zostanie utworzona nowa książka; jeśli jest podane, istniejąca książka zostanie zaktualizowana)
```
{
	"rating": 10,
	"name": "Very Interesting Book!",
	"bookYear": 2020,
	"authors":[{"id":1}]
	"categories":[{"id":2}]
}
```
* Usunięcie książki: DELETE /book/{id}, gdzie {id} to identyfikator książki

### Okładki książek

* Dodanie okładki książki: POST /book/{id}/cover, gdzie {id} to identyfikator książki. Plik jest przenoszony do pola file multipart-body
* Otrzymanie okładki książki: GET /book/{id}/cover, gdzie {id} to identyfikator książki
* Usunięcie okładki książki: DELETE /book/{id}/cover, gdzie {id} to identyfikator książki

### Recenzje książek:

* Lista wszystkich recenzji dla określonej książki : GET /book-review/?bookId={id} gdzie {id} to identyfikator książki
* Odczyt konkretnej recenzji: GET /book-review/{id}, gdzie {id} to identyfikator recenzji
* Utworzenie/aktualizacja recenzji: POST /book-review/save  z treścią żądania w formacie (jeśli pole id nie jest podane w JSON-ie, zostanie utworzona nowa recenzja; jeśli jest podane, istniejąca recenzja zostanie zaktualizowana). Jeśli jest to podrecenzja (odpowiedź na inną recenzję), dodawany jest parametr zapytania ?parentId={parentId}, gdzie {parentId} - to ID komentarza nadrzędnego
```
{
	"book": {"id": 2},
	"userName": "VeryCleverUser",
	"grade": 10,
	"reviewText": "The best book in the world",
	children: []
}
```
*  Usunięcie recenzji: DELETE /book-review/{id}, gdzie {id} to identyfikator recenzji
