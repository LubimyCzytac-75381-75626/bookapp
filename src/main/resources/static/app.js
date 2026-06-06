// elementy nawigacji
const btnLista = document.getElementById('btn-lista');
const btnDodaj = document.getElementById('btn-dodaj');
const btnPowrot = document.getElementById('btn-powrot');
const sekcjaLista = document.getElementById('sekcja-lista');
const sekcjaDodaj = document.getElementById('sekcja-dodaj');
const sekcjaSzczegoly = document.getElementById('sekcja-szczegoly');

// sterowanie widokami
function pokazSekcje(sekcja) {
    sekcjaLista.style.display = 'none';
    sekcjaDodaj.style.display = 'none';
    sekcjaSzczegoly.style.display = 'none';
    sekcja.style.display = 'block';
}

btnLista.addEventListener('click', () => {
    pokazSekcje(sekcjaLista);
    pobierzKsiazki();
});

btnDodaj.addEventListener('click', () => {
    pokazSekcje(sekcjaDodaj);
    inicjalizujDynamicznePola();
});

btnPowrot.addEventListener('click', () => {
    pokazSekcje(sekcjaLista);
});

// automatyczne dopasowanie wysokosci pola opisu
const poleOpis = document.getElementById('opis');
if (poleOpis) {
    poleOpis.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// okno modalne autora
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

// pobieranie danych slownikowych dla formularza
let pamiecAutorow = [];
let pamiecKategorii = [];

function pobierzDaneSlownikowe() {
    fetch('/author/')
        .then(res => res.json())
        .then(dane => {
            pamiecAutorow = dane;
        })
        .catch(err => console.log('blad pobierania autorow', err));

    fetch('/category/')
        .then(res => res.json())
        .then(dane => {
            pamiecKategorii = dane;
        })
        .catch(err => console.log('blad pobierania kategorii', err));
}

// obsluga pol z wybieraniem z listy
function inicjalizujDynamicznePola() {
    const kontenerAutorow = document.getElementById('kontener-autorow');
    const kontenerKategorii = document.getElementById('kontener-kategorii');
    
    kontenerAutorow.innerHTML = '';
    kontenerKategorii.innerHTML = '';

    dodajWierszZLista(kontenerAutorow, pamiecAutorow, 'id-wybranego-autora', 'Wpisz min. 3 znaki lub kliknij...', true);
    dodajWierszZLista(kontenerKategorii, pamiecKategorii, 'id-wybranej-kategorii', 'Wpisz min. 3 znaki lub kliknij...', true);
}

function dodajWierszZLista(kontener, dane, klasaDlaId, placeholder, toPierwszy) {
    const wiersz = document.createElement('div');
    wiersz.className = 'dynamiczny-wiersz';

    const opakowanie = document.createElement('div');
    opakowanie.className = 'autocomplete-wrapper';

    const poleTekstowe = document.createElement('input');
    poleTekstowe.type = 'text';
    poleTekstowe.placeholder = placeholder;
    poleTekstowe.required = true;
    poleTekstowe.autocomplete = 'off';

    const ukryteId = document.createElement('input');
    ukryteId.type = 'hidden';
    ukryteId.className = klasaDlaId;

    const divZLista = document.createElement('div');
    divZLista.className = 'autocomplete-lista';
    divZLista.style.display = 'none';

    opakowanie.appendChild(poleTekstowe);
    opakowanie.appendChild(ukryteId);
    opakowanie.appendChild(divZLista);

    const przycisk = document.createElement('button');
    przycisk.type = 'button';
    
    if (toPierwszy) {
        przycisk.className = 'btn-dynamiczny';
        przycisk.innerText = '+';
        przycisk.addEventListener('click', () => {
            dodajWierszZLista(kontener, dane, klasaDlaId, placeholder, false);
        });
    } else {
        przycisk.className = 'btn-dynamiczny btn-usun-dynamiczny';
        przycisk.innerText = '-';
        przycisk.addEventListener('click', () => {
            wiersz.remove();
        });
    }

    wiersz.appendChild(opakowanie);
    wiersz.appendChild(przycisk);
    kontener.appendChild(wiersz);

    ustawZdarzeniaDlaWiersza(poleTekstowe, ukryteId, divZLista, dane);
}

// filtrowanie po literach i kliknieciach
function ustawZdarzeniaDlaWiersza(pole, ukryteId, lista, dane) {
    pole.addEventListener('focus', () => {
        if (pole.value.length === 0) {
            budujPozycjeListy(lista, dane, pole, ukryteId);
            lista.style.display = 'block';
        } else {
            uruchomFiltrowanie(pole, ukryteId, lista, dane);
            lista.style.display = 'block';
        }
    });

    pole.addEventListener('input', () => {
        uruchomFiltrowanie(pole, ukryteId, lista, dane);
    });

    document.addEventListener('click', (e) => {
        if (e.target !== pole && e.target !== lista) {
            lista.style.display = 'none';
        }
    });
}

function uruchomFiltrowanie(pole, ukryteId, lista, dane) {
    ukryteId.value = '';
    const tekst = pole.value.toLowerCase();
    
    if (tekst.length === 0) {
        budujPozycjeListy(lista, dane, pole, ukryteId);
        lista.style.display = 'block';
        return;
    }

    if (tekst.length > 0 && tekst.length < 3) {
        lista.innerHTML = '<div class="autocomplete-pusty">Wpisz minimum 3 znaki...</div>';
        lista.style.display = 'block';
        return;
    }

    const pasujace = dane.filter(el => el.name.toLowerCase().includes(tekst));
    budujPozycjeListy(lista, pasujace, pole, ukryteId);
    lista.style.display = 'block';
}

function budujPozycjeListy(listaElement, elementy, poleElement, ukryteIdElement) {
    listaElement.innerHTML = '';
    
    if (elementy.length === 0) {
        listaElement.innerHTML = '<div class="autocomplete-pusty">Brak wyników w bazie.</div>';
        return;
    }

    elementy.forEach(el => {
        const pozycja = document.createElement('div');
        pozycja.className = 'autocomplete-item';
        pozycja.innerText = `${el.name} (id ${el.id})`;
        
        pozycja.addEventListener('mousedown', (e) => {
            e.preventDefault();
            poleElement.value = el.name;
            ukryteIdElement.value = el.id;
            listaElement.style.display = 'none';
        });
        
        listaElement.appendChild(pozycja);
    });
}

// zapisywanie autora
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
        pobierzDaneSlownikowe();
        alert('Autor został dodany do bazy!');
    })
    .catch(err => console.log('blad zapisu autora', err));
});

// zarzadzanie ksiazkami
let listaPobranychKsiazek = [];

function pobierzKsiazki() {
    const obszar = document.getElementById('lista-ksiazek-kontener');
    obszar.innerHTML = '<p class="pusty-stan">Ładowanie...</p>';

    fetch('/book/')
        .then(res => res.json())
        .then(dane => {
            listaPobranychKsiazek = dane;
            obszar.innerHTML = '';
            
            if(dane.length === 0) {
                obszar.innerHTML = '<p class="pusty-stan">Brak książek w bazie.</p>';
                return;
            }

            dane.forEach(k => {
                const ramka = document.createElement('div');
                ramka.className = 'karta-ksiazki';
                
                let tekstAutorow = "Brak autora";
                if(k.authors && k.authors.length > 0) {
                    tekstAutorow = k.authors.map(a => a.name).join(', ');
                }

                ramka.innerHTML = `
                    <div class="karta-okladka">Brak okładki</div>
                    <div class="karta-info">
                        <h3 class="karta-tytul">${k.name}</h3>
                        <p class="karta-autor">${tekstAutorow}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">Rok: ${k.bookYear}</p>
                        <button class="btn-akcja btn-maly" onclick="pokazDetale(${k.id})">Szczegóły</button>
                    </div>
                `;
                obszar.appendChild(ramka);
            });
        })
        .catch(err => {
            console.log('blad pobierania ksiazek', err);
            obszar.innerHTML = '<p class="pusty-stan">Błąd połączenia z serwerem.</p>';
        });
}

// dodawanie nowej ksiazki
const formKsiazki = document.getElementById('formularz-ksiazki');

formKsiazki.addEventListener('submit', (e) => {
    e.preventDefault();

    const autorzyPola = document.querySelectorAll('.id-wybranego-autora');
    const zebraniAutorzy = [];
    autorzyPola.forEach(p => {
        if(p.value) zebraniAutorzy.push({ id: parseInt(p.value) });
    });

    const kategoriePola = document.querySelectorAll('.id-wybranej-kategorii');
    const zebraneKategorie = [];
    kategoriePola.forEach(p => {
        if(p.value) zebraneKategorie.push({ id: parseInt(p.value) });
    });

    if(zebraniAutorzy.length === 0) {
        alert("Musisz wybrać autora z listy!");
        return;
    }

    const poleOpcjonalneOpis = document.getElementById('opis');
    
    const ksiazkaDane = {
        rating: 0, 
        name: document.getElementById('tytul').value.trim(),
        description: poleOpcjonalneOpis ? poleOpcjonalneOpis.value.trim() : "",
        bookYear: parseInt(document.getElementById('rok').value),
        authors: zebraniAutorzy,
        categories: zebraneKategorie
    };

    fetch('/book/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ksiazkaDane)
    })
    .then(res => res.json())
    .then(() => {
        formKsiazki.reset();
        if (poleOpcjonalneOpis) {
            poleOpcjonalneOpis.style.height = 'auto';
        }
        pokazSekcje(sekcjaLista);
        pobierzKsiazki();
    })
    .catch(err => console.log('blad zapisu ksiazki', err));
});

// detale i recenzje
let sprawdzanaKsiazkaId = null;

window.pokazDetale = function(id) {
    const k = listaPobranychKsiazek.find(szukana => szukana.id === id);

    if (k) {
        sprawdzanaKsiazkaId = k.id;

        let tekstAutorow = "Brak autora";
        if(k.authors && k.authors.length > 0) {
            tekstAutorow = k.authors.map(a => a.name).join(', ');
        }

        let tekstKategorii = "Brak";
        if(k.categories && k.categories.length > 0) {
            tekstKategorii = k.categories.map(c => c.name).join(', ');
        }

        document.getElementById('detale-tytul').innerText = k.name;
        document.getElementById('detale-autor').innerText = tekstAutorow;
        document.getElementById('detale-kategorie').innerText = tekstKategorii;
        document.getElementById('detale-rok').innerText = k.bookYear;
        
        document.getElementById('detale-opis').innerText = k.description ? k.description : "Brak opisu.";
        
        pokazSekcje(sekcjaSzczegoly);
        odswiezRecenzje(id);
    }
}

function odswiezRecenzje(ksiazkaId) {
    const obszarRecenzji = document.getElementById('lista-recenzji');
    obszarRecenzji.innerHTML = '<p class="pusty-stan">Ładowanie recenzji...</p>';

    fetch(`/book-review/?bookId=${ksiazkaId}`)
        .then(res => res.json())
        .then(dane => {
            obszarRecenzji.innerHTML = '';
            
            if(dane.length === 0) {
                obszarRecenzji.innerHTML = '<p class="pusty-stan">Nikt jeszcze nie ocenił tej książki. Bądź pierwszy!</p>';
                document.getElementById('detale-ocena').innerText = "Brak ocen";
                return;
            }

            let suma = 0;

            dane.forEach(r => {
                suma += r.grade;
                const klocek = document.createElement('div');
                klocek.className = 'karta-recenzji';
                klocek.innerHTML = `
                    <div class="recenzja-naglowek">
                        <span class="recenzja-autor">${r.userName}</span>
                        <span class="recenzja-ocena">${r.grade}/10</span>
                    </div>
                    <div class="recenzja-tekst">"${r.reviewText}"</div>
                `;
                obszarRecenzji.appendChild(klocek);
            });

            const wyliczonaSrednia = (suma / dane.length).toFixed(1);
            document.getElementById('detale-ocena').innerText = `${wyliczonaSrednia}/10`;
        })
        .catch(err => {
            console.log('blad ladowania recenzji', err);
            obszarRecenzji.innerHTML = '<p class="pusty-stan">Błąd ładowania recenzji.</p>';
        });
}

const formRecenzja = document.getElementById('formularz-recenzji');

formRecenzja.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!sprawdzanaKsiazkaId) return;

    const recenzjaDane = {
        book: { id: sprawdzanaKsiazkaId },
        userName: document.getElementById('recenzja-autor').value.trim(),
        grade: parseInt(document.getElementById('recenzja-ocena').value),
        reviewText: document.getElementById('recenzja-tekst').value.trim()
    };

    fetch('/book-review/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recenzjaDane)
    })
    .then(res => res.json())
    .then(() => {
        formRecenzja.reset();
        odswiezRecenzje(sprawdzanaKsiazkaId);
    })
    .catch(err => console.log('blad zapisu recenzji', err));
});

// usuwanie ksiazki
const przyciskUsun = document.getElementById('btn-usun-ksiazke');

przyciskUsun.addEventListener('click', () => {
    if (!sprawdzanaKsiazkaId) return;

    const pytanie = confirm("Czy na pewno chcesz usunąć tę książkę z bazy?");
    
    if (pytanie) {
        fetch(`/book/${sprawdzanaKsiazkaId}`, {
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

// uruchomienie podstawowych danych na starcie
pobierzDaneSlownikowe();
pobierzKsiazki();