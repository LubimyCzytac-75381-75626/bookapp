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

// przypinamy zdarzenia kliknięcia do menu
btnLista.addEventListener('click', () => pokazSekcje(sekcjaLista));
btnDodaj.addEventListener('click', () => pokazSekcje(sekcjaDodaj));
btnPowrot.addEventListener('click', () => pokazSekcje(sekcjaLista));

// tymczasowa baza danych (mock)
let ksiazkiMock = [
    { id: 1, tytul: "Wiedźmin: Ostatnie życzenie", autor: "Andrzej Sapkowski", opis: "Zbiór opowiadań o wiedźminie Geralcie z Rivii." },
    { id: 2, tytul: "Solaris", autor: "Stanisław Lem", opis: "Klasyka science fiction o kontakcie z obcą inteligencją." },
    { id: 3, tytul: "Diuna", autor: "Frank Herbert", opis: "Epicka opowieść o pustynnej planecie Arrakis." }
];

// funkcja do rysowania kart książek na stronie
function renderujListeKsiazek() {
    const kontener = document.getElementById('lista-ksiazek-kontener');
    
    // czyścimy kontener
    kontener.innerHTML = '';

    if (ksiazkiMock.length === 0) {
        kontener.innerHTML = '<p class="pusty-stan">Brak książek w katalogu.</p>';
        return;
    }

    // generujemy html dla każdej książki
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

// funkcja pokazująca szczegóły konkretnej książki
function pokazSzczegoly(id) {
    // szukamy książki w tablicy po jej id
    const ksiazka = ksiazkiMock.find(k => k.id === id);

    if (ksiazka) {
        // podmieniamy teksty w HTML na dane z obiektu
        document.getElementById('detale-tytul').innerText = ksiazka.tytul;
        document.getElementById('detale-autor').innerText = ksiazka.autor;
        document.getElementById('detale-opis').innerText = ksiazka.opis;

        // przełączamy widok na szczegóły
        pokazSekcje(sekcjaSzczegoly);
    }
}

// obsługa formularza dodawania książki
const formularz = document.getElementById('formularz-ksiazki');

formularz.addEventListener('submit', (e) => {
    e.preventDefault(); 

    // tworzymy obiekt nowej książki
    const nowaKsiazka = {
        // generujemy tymczasowe id (później zrobi to prawdziwa baza z backendu)
        id: Date.now(), 
        tytul: document.getElementById('tytul').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        opis: document.getElementById('opis').value.trim()
    };

    // wrzucamy do naszej tablicy
    ksiazkiMock.push(nowaKsiazka);

    // czyścimy pola formularza
    formularz.reset(); 
    
    // przerysowujemy listę (żeby pokazać nową książkę)
    renderujListeKsiazek();

    // wracamy do głównego ekranu
    pokazSekcje(sekcjaLista); 
});

// start aplikacji - pierwsze rysowanie listy
renderujListeKsiazek();