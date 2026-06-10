# Bookapp - frontend
## Autorzy Projektu

Projekt został zrealizowany w ramach współpracy zespołowej o jasnym podziale obowiązków:

* **Frontend Development & UI/UX:** Oleksandr Mandziuk (Numer albumu: 75381)
* **Backend Development (REST API):** Tymofii Salashnik (Numer albumu: 75626) 

# Katalog Książek – Aplikacja Frontendowa

Niniejszy projekt stanowi część kliencką (Frontend) aplikacji internetowej "Katalog Książek". Jest to w pełni interaktywny interfejs typu Single Page Application (SPA), służący до zarządzania biblioteką książek, bazą autorów, kategoriami oraz recenzjami czytelników. 

Warstwa frontendowa została stworzona od podstaw przy użyciu czystych technologii webowych, bez użycia zewnętrznych frameworków komponentowych. Zapewnia to maksymalną wydajność, brak zbędnych zależności oraz pełną kontrolę nad drzewem DOM. Aplikacja w pełni komunikuje się z backendowym serwerem poprzez architekturę REST API.

## Główne Funkcjonalności

Projekt koncentruje się na dostarczeniu intuicyjnego, responsywnego oraz dynamicznego interfejsu użytkownika. W ramach aplikacji zaimplementowano następujące moduły:

### Zarządzanie Książkami
* **Przegląd катаlogu:** Prezentacja wszystkich pozycji w formie dopasowującej się siatki kart zawierającej okładkę, informacje o autorach, rok wydania oraz średnią ocenę.
* **Tworzenie i modyfikacja:** Dynamiczne formularze umożliwiające dodawanie nowych książek oraz edycję danych już istniejących pozycji.
* **Przesyłanie plików:** Integracja z obiektem `FormData` pozwalająca na asynchroniczne wgrywanie okładek (JPEG/PNG) za pomocą żądań typu Multipart.
* **Usuwanie danych:** Bezpieczne usuwanie książek z bazy danych, zabezpieczone systemowym monitem potwierdzającym intencję użytkownika.

### Wyszukiwanie i Filtrowanie
* **Wyszukiwarka czasu rzeczywistego:** Filtrowanie pozycji po tytule bezpośrednio podczas wpisywania tekstu. Zastosowanie mechanizmu *Debounce* (opóźnienie 300 ms) skutecznie eliminuje nadmiarowe zapytania do serwera.
* **Filtr kategorii:** Dynamicznie mapowany element wyboru (`<select>`), pobierający słownik bezpośrednio z bazy danych i umożliwiający natychmiastowe zawężenie wyników. Wyszukiwarka oraz filtr mogą działać jednocześnie.

### Zarządzanie Autorami
* **Globalny skorowidz autorów:** Osobna sekcja prezentująca wszystkich twórców znajdujących се w bazie. Zbyt długie biografie są automatycznie skracane na poziomie stylów CSS (`line-clamp`), co zapobiega zaburzeniom makiety.
* **Profil szczegółowy twórcy:** Dedykowany widok zawierający pełny opis biograficzny, fotografię oraz automatycznie generowaną listę książek przypisanych do danego autora.
* **Okno modalne:** System szybkiego wprowadzania nowych autorów bezpośrednio z poziomu formularza dodawania książki, eliminujący konieczność opuszczania bieżącej sekcji.

### System Recenzji i Komentarzy
* **Drzewiasta struktura wątków:** Odpowiedzi czytelników wyświetlane są w formie zagnieżdżonej struktury. Logika aplikacji rekurencyjnie oblicza i aplikuje odpowiednie wcięcia horyzontalne zależnie od poziomu dyskusji.
* **Identyfikacja powiązań:** Czytelna wizualizacja relacji odpowiedzi (np. `NazwaUżytkownikaA → NazwaUżytkownikaB`), ułatwiająca śledzenie wielowątkowych dyskusji.
* **Agregacja ocen:** Automatyczne wyliczanie średniej arytmetycznej na podstawie ocen użytkowników (w skali 1-10) i dynamiczna aktualizacja noty widocznej na głównej karcie książki.

### Optymalizacja UX/UI
* **Komponent Autocomplete:** Autorski moduł podpowiedzi dla pól wyboru autorów oraz kategorii, inicjujący przeszukiwanie słownika po wprowadzeniu minimum 3 znaków.
* **Kontrola pól tekstowych:** Blokada horyzontalnego skalowania obszarów typu `<textarea>`, chroniąca układ graficzny przed zniekształceniem przez użytkownika.
* **Nawigacja SPA:** Przejścia pomiędzy ekranami realizowane natychmiastowo poprzez manipulację właściwościami wyświetlania elementów, bez konieczności przeładowywania dokumentu HTML.

## Stos Technologiczny

* **HTML5** – semantyczna struktura dokumentu.
* **CSS3** – stylowanie z wykorzystaniem Grid oraz Flexbox, natywne zmienne, pełna responsywność (RWD) bez użycia frameworków typu Bootstrap czy Tailwind.
* **Vanilla JavaScript (ES6+)** – logika biznesowa aplikacji, asynchroniczna manipulacja strukturą DOM, zarządzanie stanami widoków.
* **Fetch API** – komunikacja z punktami końcowymi REST API (obsługa metod GET, POST, DELETE).

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
