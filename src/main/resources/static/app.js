// elementy nawigacji i sekcje
const btnLista = document.getElementById('btn-lista');
const btnDodaj = document.getElementById('btn-dodaj');
const btnPowrot = document.getElementById('btn-powrot');
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

// obsluga modala autora
const modalAutor = document.getElementById('modal-autor');
const btnOtworzModal = document.getElementById('otworz-modal-autora');
const btnZamknijModal = document.getElementById('zamknij-modal');
const formularzAutora = document.getElementById('formularz-autora');

btnOtworzModal.addEventListener('click', () => {
    modalAutor.style.display = 'flex';
});

btnZamknijModal.addEventListener('click', () => {
    modalAutor.style.display = 'none';
});

// pobieranie autorow z serwera
let pobraniAutorzyWCache = [];

function pobierzAutorow() {
    fetch('/author/')
        .then(res => res.json())
        .then(dane => {
            pobraniAutorzyWCache = dane;
            odswiezWszystkieSelectyAutorow();
        })
        .catch(err => console.log('blad pobierania autorow', err));
}

// aktualizacja selectow autorow
function odswiezWszystkieSelectyAutorow() {
    const wszystkieSelecty = document.querySelectorAll('.select-autor');
    
    wszystkieSelecty.forEach(select => {
        const wybraneId = select.value;
        
        select.innerHTML = '<option value="">-- wybierz autora z bazy --</option>';
        pobraniAutorzyWCache.forEach(autor => {
            const opcja = document.createElement('option');
            opcja.value = autor.id;
            opcja.innerText = autor.name;
            select.appendChild(opcja);
        });
        
        if(wybraneId) {
            select.value = wybraneId;
        }
    });
}

// dynamiczne dodawanie pol autorow w formularzu
const btnDodajAutoraDoKsiazki = document.getElementById('btn-dodaj-autora');
const kontenerAutorow = document.getElementById('kontener-autorow');

btnDodajAutoraDoKsiazki.addEventListener('click', () => {
    const nowyDiv = document.createElement('div');
    nowyDiv.className = 'pole-autora';
    
    const nowySelect = document.createElement('select');
    nowySelect.className = 'input-select select-autor';
    nowySelect.required = true;
    
    nowySelect.innerHTML = '<option value="">-- wybierz autora z bazy --</option>';
    pobraniAutorzyWCache.forEach(autor => {
        const opcja = document.createElement('option');
        opcja.value = autor.id;
        opcja.innerText = autor.name;
        nowySelect.appendChild(opcja);
    });
    
    const btnMinus = document.createElement('button');
    btnMinus.type = 'button';
    btnMinus.className = 'btn-dodaj-autora btn-usun-autora';
    btnMinus.innerText = '-';
    
    btnMinus.addEventListener('click', () => {
        nowyDiv.remove();
    });
    
    nowyDiv.appendChild(nowySelect);
    nowyDiv.appendChild(btnMinus);
    kontenerAutorow.appendChild(nowyDiv);
});

// zapisywanie nowego autora do bazy
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

// pobieranie listy ksiazek
let pobraneKsiazki = [];

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

    const selecty = document.querySelectorAll('.select-autor');
    const tablicaAutorowId = [];
    
    selecty.forEach(select => {
        const idWybrane = select.value;
        if(idWybrane !== "") {
            tablicaAutorowId.push({ id: parseInt(idWybrane) });
        }
    });

    const nowaKsiazka = {
        rating: parseInt(document.getElementById('ocena').value),
        name: document.getElementById('tytul').value.trim(),
        bookYear: parseInt(document.getElementById('rok').value),
        authors: tablicaAutorowId
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
        
        const wszystkiePola = document.querySelectorAll('.pole-autora');
        for (let i = 1; i < wszystkiePola.length; i++) {
            wszystkiePola[i].remove();
        }

        pokazSekcje(sekcjaLista);
        pobierzKsiazki();
    })
    .catch(err => console.log('blad zapisu ksiazki', err));
});

// pokazywanie szczegolow i przygotowanie do usuwania
let aktualniePrzegladanaKsiazkaId = null;

window.pokazDetale = function(id) {
    const ksiazka = pobraneKsiazki.find(k => k.id === id);

    if (ksiazka) {
        aktualniePrzegladanaKsiazkaId = ksiazka.id;

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

// usuwanie ksiazki
const btnUsunKsiazke = document.getElementById('btn-usun-ksiazke');

btnUsunKsiazke.addEventListener('click', () => {
    if (!aktualniePrzegladanaKsiazkaId) return;

    const czyUsunac = confirm("Czy na pewno chcesz usunąć tę książkę z bazy?");
    
    if (czyUsunac) {
        fetch(`/book/${aktualniePrzegladanaKsiazkaId}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (res.ok) {
                alert("Książka została usunięta.");
                pokazSekcje(sekcjaLista);
                pobierzKsiazki();
            } else {
                alert("Wystąpił błąd podczas usuwania.");
            }
        })
        .catch(err => console.log('blad usuwania', err));
    }
});

// start aplikacji
pobierzKsiazki();