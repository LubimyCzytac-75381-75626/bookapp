// elementy dom
const btnLista = document.getElementById('btn-lista');
const btnDodaj = document.getElementById('btn-dodaj');
const btnPowrot = document.getElementById('btn-powrot');
const btnPowrotZAutora = document.getElementById('btn-powrot-z-autora');

const sekcjaLista = document.getElementById('sekcja-lista');
const sekcjaDodaj = document.getElementById('sekcja-dodaj');
const sekcjaSzczegoly = document.getElementById('sekcja-szczegoly');
const sekcjaAutorSzczegoly = document.getElementById('sekcja-autor-szczegoly');

let skadWidokAutora = sekcjaLista;

// zarzadzanie sekcjami
function pokazSekcje(sekcja) {
    sekcjaLista.style.display = 'none';
    sekcjaDodaj.style.display = 'none';
    sekcjaSzczegoly.style.display = 'none';
    if (sekcjaAutorSzczegoly) sekcjaAutorSzczegoly.style.display = 'none';
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

if (btnPowrotZAutora) {
    btnPowrotZAutora.addEventListener('click', () => {
        pokazSekcje(skadWidokAutora);
    });
}

// dynamiczna wysokosc opisu
const poleOpis = document.getElementById('opis');
if (poleOpis) {
    poleOpis.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

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

// obsluga zdjecia autora w formularzu
let plikAutora = null;
const inputAutorFoto = document.getElementById('plik-autor-foto');
const obszarAutorKlik = document.getElementById('autor-foto-obszar-klik');
const podgladAutorImg = document.getElementById('autor-foto-podglad');
const podgladAutorTekst = document.getElementById('autor-foto-tekst');

if (obszarAutorKlik && inputAutorFoto) {
    obszarAutorKlik.addEventListener('click', () => {
        inputAutorFoto.click();
    });

    inputAutorFoto.addEventListener('change', (e) => {
        const plik = e.target.files[0];
        if (plik) {
            plikAutora = plik;
            const urlObrazka = URL.createObjectURL(plik);
            podgladAutorImg.src = urlObrazka;
            podgladAutorImg.style.display = 'block';
            podgladAutorTekst.style.display = 'none';
        }
    });
}

function zresetujPodgladAutora() {
    plikAutora = null;
    if (inputAutorFoto) inputAutorFoto.value = '';
    if (podgladAutorImg) {
        podgladAutorImg.src = '';
        podgladAutorImg.style.display = 'none';
    }
    if (podgladAutorTekst) podgladAutorTekst.style.display = 'block';
}

// obsluga wgrania okładki w formularzu
let plikOkladki = null;
const inputOkladka = document.getElementById('plik-okladka');
const obszarOkladkiKlik = document.getElementById('okladka-obszar-klik');
const podgladOkladkiImg = document.getElementById('okladka-podglad');
const podgladOkladkiTekst = document.getElementById('okladka-tekst');

if (obszarOkladkiKlik && inputOkladka) {
    obszarOkladkiKlik.addEventListener('click', () => {
        inputOkladka.click();
    });

    inputOkladka.addEventListener('change', (e) => {
        const plik = e.target.files[0];
        if (plik) {
            plikOkladki = plik;
            const urlObrazka = URL.createObjectURL(plik);
            podgladOkladkiImg.src = urlObrazka;
            podgladOkladkiImg.style.display = 'block';
            podgladOkladkiTekst.style.display = 'none';
            obszarOkladkiKlik.style.padding = '0';
        }
    });
}

function zresetujPodgladOkladki() {
    plikOkladki = null;
    if (inputOkladka) inputOkladka.value = '';
    if (podgladOkladkiImg) {
        podgladOkladkiImg.src = '';
        podgladOkladkiImg.style.display = 'none';
    }
    if (podgladOkladkiTekst) podgladOkladkiTekst.style.display = 'block';
    if (obszarOkladkiKlik) obszarOkladkiKlik.style.padding = '30px 20px';
}

// pobieranie slownikow formularza
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

// autocomplete logiki
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

// zapis nowego autora do bazy
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
    .then(res => {
        if (!res.ok) throw new Error("Błąd z serwerem");
        return res.json();
    })
    .then(zapisanyAutor => {
        if (plikAutora && zapisanyAutor && zapisanyAutor.id) {
            const formData = new FormData();
            formData.append('file', plikAutora);

            return fetch(`/author/${zapisanyAutor.id}/photo`, {
                method: 'POST',
                body: formData
            });
        }
        return Promise.resolve();
    })
    .then(() => {
        modalAutor.style.display = 'none';
        formularzAutora.reset();
        zresetujPodgladAutora();
        pobierzDaneSlownikowe();
        alert('Autor został dodany do bazy!');
    })
    .catch(err => console.log('blad zapisu autora', err));
});

// logika ksiazek i szczegolow
let listaPobranychKsiazek = [];
let sprawdzanaKsiazkaId = null;

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
                    tekstAutorow = k.authors.map(a => `<span class="klikany-autor" onclick="skadWidokAutora = sekcjaLista; pokazDetaleAutora(${a.id}); event.stopPropagation();">${a.name}</span>`).join(', ');
                }

                ramka.innerHTML = `
                    <img src="/book/${k.id}/cover" class="karta-img" onerror="this.outerHTML='<div class=\\'karta-okladka-zastepcza\\'>Brak okładki</div>'">
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
        alert("Musisz wybrać prawidłowego autora z listy!");
        return;
    }

    if(zebraneKategorie.length === 0) {
        alert("Musisz wybrać prawidłową kategorię z listy!");
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
    .then(res => {
        if (!res.ok) throw new Error("Błąd podczas zapisywania książki. Sprawdź serwer.");
        return res.json();
    })
    .then(zapisanaKsiazka => {
        if (plikOkladki && zapisanaKsiazka && zapisanaKsiazka.id) {
            const formData = new FormData();
            formData.append('file', plikOkladki);

            return fetch(`/book/${zapisanaKsiazka.id}/cover`, {
                method: 'POST',
                body: formData
            });
        }
        return Promise.resolve();
    })
    .then(() => {
        formKsiazki.reset();
        zresetujPodgladOkladki();
        if (poleOpcjonalneOpis) {
            poleOpcjonalneOpis.style.height = 'auto';
        }
        pokazSekcje(sekcjaLista);
        pobierzKsiazki();
    })
    .catch(err => {
        console.log('blad zapisu ksiazki', err);
        alert("Zapisywanie nie powiodło się! Sprawdź czy wybrałeś dane z listy.");
    });
});

window.pokazDetale = function(id) {
    const k = listaPobranychKsiazek.find(szukana => szukana.id === id);

    if (k) {
        sprawdzanaKsiazkaId = k.id;

        let tekstAutorow = "Brak autora";
        if(k.authors && k.authors.length > 0) {
            tekstAutorow = k.authors.map(a => `<span class="klikany-autor" onclick="skadWidokAutora = sekcjaSzczegoly; pokazDetaleAutora(${a.id}); event.stopPropagation();">${a.name}</span>`).join(', ');
        }

        let tekstKategorii = "Brak";
        if(k.categories && k.categories.length > 0) {
            tekstKategorii = k.categories.map(c => c.name).join(', ');
        }

        document.getElementById('detale-tytul').innerText = k.name;
        document.getElementById('detale-autor').innerHTML = tekstAutorow;
        document.getElementById('detale-kategorie').innerText = tekstKategorii;
        document.getElementById('detale-rok').innerText = k.bookYear;
        
        document.getElementById('detale-opis').innerText = k.description ? k.description : "Brak opisu.";
        
        const imgOkladka = document.getElementById('detale-okladka-img');
        const brakOkladki = document.getElementById('detale-okladka-brak');
        
        if (imgOkladka && brakOkladki) {
            imgOkladka.src = `/book/${k.id}/cover`;
            imgOkladka.style.display = 'block';
            brakOkladki.style.display = 'none';

            imgOkladka.onerror = function() {
                imgOkladka.style.display = 'none';
                brakOkladki.style.display = 'flex';
            };
        }
        
        pokazSekcje(sekcjaSzczegoly);
        odswiezRecenzje(id);
    }
}

// pobieranie detali pojedynczego autora
window.pokazDetaleAutora = function(id) {
    fetch(`/author/${id}`)
        .then(res => res.json())
        .then(autor => {
            document.getElementById('autor-detale-nazwa').innerText = autor.name;
            document.getElementById('autor-detale-bio').innerText = autor.biography ? autor.biography : "Brak biografii.";

            const imgZdjecie = document.getElementById('autor-detale-img');
            const brakZdjecia = document.getElementById('autor-detale-brak');

            if (imgZdjecie && brakZdjecia) {
                imgZdjecie.src = `/author/${id}/photo`;
                imgZdjecie.style.display = 'block';
                brakZdjecia.style.display = 'none';

                imgZdjecie.onerror = function() {
                    imgZdjecie.style.display = 'none';
                    brakZdjecia.style.display = 'flex';
                };
            }

            pokazSekcje(sekcjaAutorSzczegoly);
        })
        .catch(err => console.log('blad pobierania danych autora', err));
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

// zaladowanie na starcie
pobierzDaneSlownikowe();
pobierzKsiazki();