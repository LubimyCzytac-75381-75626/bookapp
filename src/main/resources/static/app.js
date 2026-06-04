const btnLista = document.getElementById('btn-lista');
const btnDodaj = document.getElementById('btn-dodaj');
const btnPowrot = document.getElementById('btn-powrot');
const sekcjaLista = document.getElementById('sekcja-lista');
const sekcjaDodaj = document.getElementById('sekcja-dodaj');
const sekcjaSzczegoly = document.getElementById('sekcja-szczegoly');

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
    inicjalizujPolaDynamiczne();
});

btnPowrot.addEventListener('click', () => {
    pokazSekcje(sekcjaLista);
});

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

let pobraniAutorzyWCache = [];
let pobraneKategorieWCache = [];

function pobierzDaneDoSlownikow() {
    fetch('/author/')
        .then(res => res.json())
        .then(dane => {
            pobraniAutorzyWCache = dane;
        })
        .catch(err => console.log('blad pobierania autorow', err));

    fetch('/category/')
        .then(res => {
            if(!res.ok) throw new Error('Brak endpointu');
            return res.json();
        })
        .then(dane => {
            pobraneKategorieWCache = dane;
        })
        .catch(() => {
            pobraneKategorieWCache = [
                { id: 1, name: "Fantastyka" },
                { id: 2, name: "Kryminał" },
                { id: 3, name: "Romans" },
                { id: 4, name: "Thriller" },
                { id: 5, name: "Biografia" }
            ];
        });
}

function inicjalizujPolaDynamiczne() {
    const kontenerAutorow = document.getElementById('kontener-autorow');
    const kontenerKategorii = document.getElementById('kontener-kategorii');
    
    kontenerAutorow.innerHTML = '';
    kontenerKategorii.innerHTML = '';

    dodajPoleAutocomplete(kontenerAutorow, pobraniAutorzyWCache, 'autor-wybrany-id', 'Wpisz min. 3 znaki lub kliknij...', true);
    dodajPoleAutocomplete(kontenerKategorii, pobraneKategorieWCache, 'kategoria-wybrana-id', 'Wpisz min. 3 znaki lub kliknij...', true);
}

function dodajPoleAutocomplete(kontener, daneZrodlowe, nazwaKlasyId, placeholderTekst, czyPierwsze) {
    const wiersz = document.createElement('div');
    wiersz.className = 'dynamiczny-wiersz';

    const wrapper = document.createElement('div');
    wrapper.className = 'autocomplete-wrapper';

    const inputTekstowy = document.createElement('input');
    inputTekstowy.type = 'text';
    inputTekstowy.placeholder = placeholderTekst;
    inputTekstowy.required = true;
    inputTekstowy.autocomplete = 'off';

    const ukrytyInputId = document.createElement('input');
    ukrytyInputId.type = 'hidden';
    ukrytyInputId.className = nazwaKlasyId;

    const listaPodpowiedzi = document.createElement('div');
    listaPodpowiedzi.className = 'autocomplete-lista';
    listaPodpowiedzi.style.display = 'none';

    wrapper.appendChild(inputTekstowy);
    wrapper.appendChild(ukrytyInputId);
    wrapper.appendChild(listaPodpowiedzi);

    const btnAkcja = document.createElement('button');
    btnAkcja.type = 'button';
    
    if (czyPierwsze) {
        btnAkcja.className = 'btn-dynamiczny';
        btnAkcja.innerText = '+';
        btnAkcja.addEventListener('click', () => {
            dodajPoleAutocomplete(kontener, daneZrodlowe, nazwaKlasyId, placeholderTekst, false);
        });
    } else {
        btnAkcja.className = 'btn-dynamiczny btn-usun-dynamiczny';
        btnAkcja.innerText = '-';
        btnAkcja.addEventListener('click', () => {
            wiersz.remove();
        });
    }

    wiersz.appendChild(wrapper);
    wiersz.appendChild(btnAkcja);
    kontener.appendChild(wiersz);

    konfigurujZachowanieAutocomplete(inputTekstowy, ukrytyInputId, listaPodpowiedzi, daneZrodlowe);
}

function konfigurujZachowanieAutocomplete(input, ukryteId, lista, dane) {
    input.addEventListener('focus', () => {
        renderujListeAutocomplete(lista, dane, input, ukryteId);
        lista.style.display = 'block';
    });

    input.addEventListener('input', () => {
        ukryteId.value = '';
        const wpisane = input.value.toLowerCase();
        
        if (wpisane.length === 0) {
            renderujListeAutocomplete(lista, dane, input, ukryteId);
            return;
        }

        if (wpisane.length > 0 && wpisane.length < 3) {
            lista.innerHTML = '<div class="autocomplete-pusty">Wpisz minimum 3 znaki...</div>';
            lista.style.display = 'block';
            return;
        }

        const przefiltrowane = dane.filter(el => el.name.toLowerCase().includes(wpisane));
        renderujListeAutocomplete(lista, przefiltrowane, input, ukryteId);
    });

    document.addEventListener('click', (e) => {
        if (e.target !== input && e.target !== lista) {
            lista.style.display = 'none';
        }
    });
}

function renderujListeAutocomplete(listaElement, dane, inputElement, ukryteIdElement) {
    listaElement.innerHTML = '';
    
    if (dane.length === 0) {
        listaElement.innerHTML = '<div class="autocomplete-pusty">Brak wyników w bazie.</div>';
        return;
    }

    dane.forEach(el => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.innerText = `${el.name} (id ${el.id})`;
        
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            inputElement.value = el.name;
            ukryteIdElement.value = el.id;
            listaElement.style.display = 'none';
        });
        
        listaElement.appendChild(item);
    });
}

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
        pobierzDaneDoSlownikow();
        alert('Autor został dodany do bazy!');
    })
    .catch(err => console.log('blad zapisu autora', err));
});

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

const formularzKsiazki = document.getElementById('formularz-ksiazki');

formularzKsiazki.addEventListener('submit', (e) => {
    e.preventDefault();

    const ukryteAutorzyId = document.querySelectorAll('.autor-wybrany-id');
    const tablicaAutorow = [];
    ukryteAutorzyId.forEach(input => {
        if(input.value) tablicaAutorow.push({ id: parseInt(input.value) });
    });

    const ukryteKategorieId = document.querySelectorAll('.kategoria-wybrana-id');
    const tablicaKategorii = [];
    ukryteKategorieId.forEach(input => {
        if(input.value) tablicaKategorii.push({ id: parseInt(input.value) });
    });

    if(tablicaAutorow.length === 0) {
        alert("Musisz wybrać autora z listy!");
        return;
    }

    const nowaKsiazka = {
        rating: 0, 
        name: document.getElementById('tytul').value.trim(),
        bookYear: parseInt(document.getElementById('rok').value),
        authors: tablicaAutorow,
        categories: tablicaKategorii
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

let aktualniePrzegladanaKsiazkaId = null;

window.pokazDetale = function(id) {
    const ksiazka = pobraneKsiazki.find(k => k.id === id);

    if (ksiazka) {
        aktualniePrzegladanaKsiazkaId = ksiazka.id;

        let nazwyAutorow = "Brak autora";
        if(ksiazka.authors && ksiazka.authors.length > 0) {
            nazwyAutorow = ksiazka.authors.map(a => a.name).join(', ');
        }

        let nazwyKategorii = "Brak";
        if(ksiazka.categories && ksiazka.categories.length > 0) {
            nazwyKategorii = ksiazka.categories.map(c => c.name).join(', ');
        }

        document.getElementById('detale-tytul').innerText = ksiazka.name;
        document.getElementById('detale-autor').innerText = nazwyAutorow;
        document.getElementById('detale-kategorie').innerText = nazwyKategorii;
        document.getElementById('detale-rok').innerText = ksiazka.bookYear;
        
        pokazSekcje(sekcjaSzczegoly);
        pobierzRecenzje(id);
    }
}

function pobierzRecenzje(bookId) {
    const kontener = document.getElementById('lista-recenzji');
    kontener.innerHTML = '<p class="pusty-stan">Ładowanie recenzji...</p>';

    fetch(`/book-review/?bookId=${bookId}`)
        .then(res => res.json())
        .then(dane => {
            kontener.innerHTML = '';
            
            if(dane.length === 0) {
                kontener.innerHTML = '<p class="pusty-stan">Nikt jeszcze nie ocenił tej książki. Bądź pierwszy!</p>';
                document.getElementById('detale-ocena').innerText = "Brak ocen";
                return;
            }

            let sumaOcen = 0;

            dane.forEach(recenzja => {
                sumaOcen += recenzja.grade;
                const karta = document.createElement('div');
                karta.className = 'karta-recenzji';
                karta.innerHTML = `
                    <div class="recenzja-naglowek">
                        <span class="recenzja-autor">${recenzja.userName}</span>
                        <span class="recenzja-ocena">${recenzja.grade}/10</span>
                    </div>
                    <div class="recenzja-tekst">"${recenzja.reviewText}"</div>
                `;
                kontener.appendChild(karta);
            });

            const srednia = (sumaOcen / dane.length).toFixed(1);
            document.getElementById('detale-ocena').innerText = `${srednia}/10`;
        })
        .catch(err => {
            console.log('blad pobierania recenzji', err);
            kontener.innerHTML = '<p class="pusty-stan">Błąd ładowania recenzji.</p>';
        });
}

const formularzRecenzji = document.getElementById('formularz-recenzji');

formularzRecenzji.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!aktualniePrzegladanaKsiazkaId) return;

    const nowaRecenzja = {
        book: { id: aktualniePrzegladanaKsiazkaId },
        userName: document.getElementById('recenzja-autor').value.trim(),
        grade: parseInt(document.getElementById('recenzja-ocena').value),
        reviewText: document.getElementById('recenzja-tekst').value.trim()
    };

    fetch('/book-review/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nowaRecenzja)
    })
    .then(res => res.json())
    .then(() => {
        formularzRecenzji.reset();
        pobierzRecenzje(aktualniePrzegladanaKsiazkaId);
    })
    .catch(err => console.log('blad zapisu recenzji', err));
});

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

pobierzDaneDoSlownikow();
pobierzKsiazki();