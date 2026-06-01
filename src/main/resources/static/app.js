// elementy nawigacji
const btnLista = document.getElementById('btn-lista');
const btnDodaj = document.getElementById('btn-dodaj');
const btnPowrot = document.getElementById('btn-powrot');

// sekcje w html
const sekcjaLista = document.getElementById('sekcja-lista');
const sekcjaDodaj = document.getElementById('sekcja-dodaj');
const sekcjaSzczegoly = document.getElementById('sekcja-szczegoly');

// logika przelaczania widokow
function pokazSekcje(sekcja) {
    sekcjaLista.style.display = 'none';
    sekcjaDodaj.style.display = 'none';
    sekcjaSzczegoly.style.display = 'none';
    sekcja.style.display = 'block';
}

// zdarzenia dla menu
btnLista.addEventListener('click', () => {
    pokazSekcje(sekcjaLista);
    pobierzKsiazki();
});

btnDodaj.addEventListener('click', () => {
    pokazSekcje(sekcjaDodaj);
    pobierzAutorow();
});

btnPowrot.addEventListener('click', () => {
    pokazSekcje(sekcjaLista);
});

// modal autora elementy
const modalAutor = document.getElementById('modal-autor');
const btnOtworzModal = document.getElementById('otworz-modal-autora');
const btnZamknijModal = document.getElementById('zamknij-modal');
const formularzAutora = document.getElementById('formularz-autora');
const selectAutor = document.getElementById('autor-select');

// obsluga modala
btnOtworzModal.addEventListener('click', () => {
    modalAutor.style.display = 'flex';
});

btnZamknijModal.addEventListener('click', () => {
    modalAutor.style.display = 'none';
});

// pobieranie autorow z serwera
function pobierzAutorow() {
    fetch('/author/')
        .then(res => res.json())
        .then(dane => {
            selectAutor.innerHTML = '<option value="">-- wybierz autora z bazy --</option>';
            
            dane.forEach(autor => {
                const opcja = document.createElement('option');
                opcja.value = autor.id;
                opcja.innerText = autor.name;
                selectAutor.appendChild(opcja);
            });
        })
        .catch(err => console.log('blad pobierania autorow', err));
}

// zapisywanie autora do bazy
formularzAutora.addEventListener('submit', (e) => {
    e.preventDefault();

    const nowyAutor = {
        name: document.getElementById('nowy-autor-nazwa').value.trim(),
        biography: document.getElementById('nowy-autor-bio').value.trim()
    };

    fetch('/author/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nowyAutor)
    })
    .then(res => res.json())
    .then(() => {
        modalAutor.style.display = 'none';
        formularzAutora.reset();
        pobierzAutorow();
        alert('Autor został dodany do bazy!');
    })
    .catch(err => console.log('blad zapisu autora', err));
});

// glowna tablica ksiazek do pamietania danych na froncie
let pobraneKsiazki = [];

// pobieranie listy ksiazek
function pobierzKsiazki() {
    const kontener = document.getElementById('lista-ksiazek-kontener');
    kontener.innerHTML = '<p class="pusty-stan">Ładowanie...</p>';

    fetch('/book/')
        .then(res => res.json())
        .then(dane => {
            pobraneKsiazki = dane;
            kontener.innerHTML = '';
            
            if(dane.length === 0) {
                kontener.innerHTML = '<p class="pusty-stan">Brak książek w bazie.</p>';
                return;
            }

            dane.forEach(ksiazka => {
                const karta = document.createElement('div');
                karta.className = 'karta-ksiazki';
                
                let nazwyAutorow = "Brak autora";
                if(ksiazka.authors && ksiazka.authors.length > 0) {
                    nazwyAutorow = ksiazka.authors.map(a => a.name).join(', ');
                }

                karta.innerHTML = `
                    <div class="karta-okladka">Brak okładki</div>
                    <div class="karta-info">
                        <h3 class="karta-tytul">${ksiazka.name}</h3>
                        <p class="karta-autor">${nazwyAutorow}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">Rok: ${ksiazka.bookYear}</p>
                        <button class="btn-akcja btn-maly" onclick="pokazDetale(${ksiazka.id})">Szczegóły</button>
                    </div>
                `;
                kontener.appendChild(karta);
            });
        })
        .catch(err => {
            console.log('blad pobierania ksiazek', err);
            kontener.innerHTML = '<p class="pusty-stan">Błąd połączenia z serwerem.</p>';
        });
}

// zapisywanie nowej ksiazki
const formularzKsiazki = document.getElementById('formularz-ksiazki');

formularzKsiazki.addEventListener('submit', (e) => {
    e.preventDefault();

    const wybranyAutorId = document.getElementById('autor-select').value;

    const nowaKsiazka = {
        rating: parseInt(document.getElementById('ocena').value),
        name: document.getElementById('tytul').value.trim(),
        bookYear: parseInt(document.getElementById('rok').value),
        authors: [{ id: parseInt(wybranyAutorId) }]
    };

    fetch('/book/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nowaKsiazka)
    })
    .then(res => res.json())
    .then(() => {
        formularzKsiazki.reset();
        pokazSekcje(sekcjaLista);
        pobierzKsiazki();
    })
    .catch(err => console.log('blad zapisu ksiazki', err));
});

// pokazywanie szczegolow wybranej ksiazki
window.pokazDetale = function(id) {
    const ksiazka = pobraneKsiazki.find(k => k.id === id);

    if (ksiazka) {
        let nazwyAutorow = "Brak autora";
        if(ksiazka.authors && ksiazka.authors.length > 0) {
            nazwyAutorow = ksiazka.authors.map(a => a.name).join(', ');
        }

        document.getElementById('detale-tytul').innerText = ksiazka.name;
        document.getElementById('detale-autor').innerText = nazwyAutorow;
        document.getElementById('detale-rok').innerText = ksiazka.bookYear;
        document.getElementById('detale-ocena').innerText = ksiazka.rating;

        pokazSekcje(sekcjaSzczegoly);
    }
}

// pierwsze ladowanie przy wejsciu na strone
pobierzKsiazki();