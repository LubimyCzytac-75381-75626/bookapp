// elementy nawigacji
const btnLista = document.getElementById('btn-lista');
const btnDodaj = document.getElementById('btn-dodaj');
const btnPowrot = document.getElementById('btn-powrot');

// sekcje (ekrany)
const sekcjaLista = document.getElementById('sekcja-lista');
const sekcjaDodaj = document.getElementById('sekcja-dodaj');
const sekcjaSzczegoly = document.getElementById('sekcja-szczegoly');

// logika przełączania ekranów
function pokazSekcje(sekcjaDoPokazania) {
    // najpierw ukrywamy wszystkie sekcje
    sekcjaLista.style.display = 'none';
    sekcjaDodaj.style.display = 'none';
    sekcjaSzczegoly.style.display = 'none';

    // pokazujemy tylko tę, o którą prosimy
    sekcjaDoPokazania.style.display = 'block';
}

// przypinamy zdarzenia kliknięcia do przycisków
btnLista.addEventListener('click', () => pokazSekcje(sekcjaLista));
btnDodaj.addEventListener('click', () => pokazSekcje(sekcjaDodaj));
btnPowrot.addEventListener('click', () => pokazSekcje(sekcjaLista));

// obsługa formularza dodawania książki
const formularz = document.getElementById('formularz-ksiazki');

formularz.addEventListener('submit', (e) => {
    // zatrzymujemy przeładowanie strony
    e.preventDefault(); 

    // zbieramy dane z formularza
    const nowaKsiazka = {
        tytul: document.getElementById('tytul').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        opis: document.getElementById('opis').value.trim()
    };

    // wypisujemy w konsoli do testów
    console.log('dane gotowe do wysłania na backend:', nowaKsiazka);
    alert('Dane zebrane! Otwórz konsolę (F12).');

    // czyścimy formularz po kliknięciu
    formularz.reset(); 
    
    // automatycznie wracamy do listy książek
    pokazSekcje(sekcjaLista); 
});

// tymczasowa baza danych (mock) do testowania interfejsu
let ksiazkiMock = [
    { 
        id: 1, 
        tytul: "Wiedźmin: Ostatnie życzenie", 
        autor: "Andrzej Sapkowski", 
        opis: "Zbiór opowiadań o wiedźminie Geralcie z Rivii." 
    },
    { 
        id: 2, 
        tytul: "Solaris", 
        autor: "Stanisław Lem", 
        opis: "Klasyka science fiction o kontakcie z obcą inteligencją na planecie pokrytej żywym oceanem." 
    },
    { 
        id: 3, 
        tytul: "Diuna", 
        autor: "Frank Herbert", 
        opis: "Epicka opowieść o pustynnej planecie Arrakis i najcenniejszej substancji we wszechświecie - przyprawie." 
    }
];

// funkcja do rysowania kart książek na stronie
function renderujListeKsiazek() {
    const kontener = document.getElementById('lista-ksiazek-kontener');

    kontener.innerHTML = '';

    if (ksiazkiMock.length === 0) {
        kontener.innerHTML = '<p class="pusty-stan">Brak książek w katalogu.</p>';
        return;
    }

    ksiazkiMock.forEach(ksiazka => {
        const karta = document.createElement('div');
        karta.className = 'karta-ksiazki';

        karta.innerHTML = `
            <div class="karta-okladka">Brak okładki</div>
            <div class="karta-info">
                <h3 class="karta-tytul">${ksiazka.tytul}</h3>
                <p class="karta-autor">${ksiazka.autor}</p>
                <button class="btn-akcja btn-maly" onclick="pokazSzczegoly(${ksiazka.id})">Szczegóły</button>
            </div>
        `;

        kontener.appendChild(karta);
    });
}

// tymczasowa funkcja do przycisku szczegółów 
function pokazSzczegoly(id) {
    console.log('kliknięto szczegóły książki o id:', id);
    alert('Funkcja szczegółów w budowie! Wybrano ID: ' + id);
}

renderujListeKsiazek();