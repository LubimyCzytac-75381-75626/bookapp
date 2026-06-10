// elementy dom
const logoStrony = document.getElementById('logo-strony');
const btnLista = document.getElementById('btn-lista');
const btnDodaj = document.getElementById('btn-dodaj');
const btnAutorzy = document.getElementById('btn-autorzy'); 
const btnPowrot = document.getElementById('btn-powrot');
const btnPowrotZAutora = document.getElementById('btn-powrot-z-autora');
const btnPowrotZDodaj = document.getElementById('btn-powrot-z-dodaj'); 
const btnUsunAutora = document.getElementById('btn-usun-autora'); 
const filtrKategorii = document.getElementById('filtr-kategorii'); 
const wyszukiwarkaKsiazek = document.getElementById('wyszukiwarka-ksiazek');
const wyszukiwarkaAutorow = document.getElementById('wyszukiwarka-autorow');
const btnEdytujKsiazke = document.getElementById('btn-edytuj-ksiazke'); 
const btnMotyw = document.getElementById('btn-motyw');

const sekcjaLista = document.getElementById('sekcja-lista');
const sekcjaDodaj = document.getElementById('sekcja-dodaj');
const sekcjaSzczegoly = document.getElementById('sekcja-szczegoly');
const sekcjaAutorSzczegoly = document.getElementById('sekcja-autor-szczegoly');
const sekcjaAutorzyLista = document.getElementById('sekcja-autorzy-lista'); 

let skadWidokAutora = sekcjaLista;
let edytowanaKsiazkaId = null; 
let pelnaListaAutorow = []; // zmienna pomocnicza do wyszukiwarki autorow

// obsluga ciemnego motywu
if (btnMotyw) {
    const aktualnyMotyw = localStorage.getItem('motyw');
    
    if (aktualnyMotyw === 'ciemny') {
        document.body.classList.add('dark-mode');
        btnMotyw.innerText = '☀️';
    }

    btnMotyw.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('motyw', 'ciemny');
            btnMotyw.innerText = '☀️';
        } else {
            localStorage.setItem('motyw', 'jasny');
            btnMotyw.innerText = '🌙';
        }
    });
}

// zarzadzanie sekcjami
function pokazSekcje(sekcja) {
    sekcjaLista.style.display = 'none';
    sekcjaDodaj.style.display = 'none';
    sekcjaSzczegoly.style.display = 'none';
    if (sekcjaAutorSzczegoly) sekcjaAutorSzczegoly.style.display = 'none';
    if (sekcjaAutorzyLista) sekcjaAutorzyLista.style.display = 'none';
    sekcja.style.display = 'block';
}

if (logoStrony) {
    logoStrony.addEventListener('click', () => {
        pokazSekcje(sekcjaLista);
        pobierzKsiazki();
    });
}

btnLista.addEventListener('click', () => {
    pokazSekcje(sekcjaLista);
    pobierzKsiazki();
});

if (btnAutorzy) {
    btnAutorzy.addEventListener('click', () => {
        if (wyszukiwarkaAutorow) wyszukiwarkaAutorow.value = '';
        pokazSekcje(sekcjaAutorzyLista);
        pobierzWszystkichAutorow();
    });
}

btnDodaj.addEventListener('click', () => {
    edytowanaKsiazkaId = null;
    const formKsiazki = document.getElementById('formularz-ksiazki');
    if (formKsiazki) formKsiazki.reset();
    zresetujPodgladOkladki();
    const btnZapisz = document.getElementById('btn-zapisz');
    if (btnZapisz) btnZapisz.innerText = 'Zapisz książkę';
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

if (btnPowrotZDodaj) {
    btnPowrotZDodaj.addEventListener('click', () => {
        pokazSekcje(sekcjaLista);
    });
}

if (btnUsunAutora) {
    btnUsunAutora.addEventListener('click', () => {
        window.usunAutora();
    });
}

// zdarzenie dla filtra kategorii
if (filtrKategorii) {
    filtrKategorii.addEventListener('change', () => {
        pobierzKsiazki();
    });
}

// zdarzenie dla wyszukiwarki ksiazek
if (wyszukiwarkaKsiazek) {
    let timeoutWyszukiwarki;
    wyszukiwarkaKsiazek.addEventListener('input', () => {
        clearTimeout(timeoutWyszukiwarki);
        timeoutWyszukiwarki = setTimeout(() => {
            pobierzKsiazki();
        }, 300);
    });
}

// zdarzenie dla wyszukiwarki autorow
if (wyszukiwarkaAutorow) {
    wyszukiwarkaAutorow.addEventListener('input', (e) => {
        const tekst = e.target.value.toLowerCase().trim();
        if (tekst === '') {
            renderujListeAutorow(pelnaListaAutorow);
        } else {
            const przefiltrowani = pelnaListaAutorow.filter(a => a.name.toLowerCase().includes(tekst));
            renderujListeAutorow(przefiltrowani);
        }
    });
}

// logika edycji ksiazki
if (btnEdytujKsiazke) {
    btnEdytujKsiazke.addEventListener('click', () => {
        const k = listaPobranychKsiazek.find(szukana => szukana.id === sprawdzanaKsiazkaId);
        if (!k) return;

        edytowanaKsiazkaId = k.id;
        
        document.getElementById('tytul').value = k.name;
        document.getElementById('rok').value = k.bookYear;
        const poleOpis = document.getElementById('opis');
        if (poleOpis) poleOpis.value = k.description ? k.description : "";
        
        const kontenerAutorow = document.getElementById('kontener-autorow');
        const kontenerKategorii = document.getElementById('kontener-kategorii');
        kontenerAutorow.innerHTML = '';
        kontenerKategorii.innerHTML = '';

        if (k.authors && k.authors.length > 0) {
            k.authors.forEach((a, index) => {
                dodajWierszZLista(kontenerAutorow, pamiecAutorow, 'id-wybranego-autora', 'Wpisz min. 3 znaki lub kliknij...', index === 0, a.id, a.name);
            });
        } else {
            dodajWierszZLista(kontenerAutorow, pamiecAutorow, 'id-wybranego-autora', 'Wpisz min. 3 znaki lub kliknij...', true);
        }

        if (k.categories && k.categories.length > 0) {
            k.categories.forEach((c, index) => {
                dodajWierszZLista(kontenerKategorii, pamiecKategorii, 'id-wybranej-kategorii', 'Wpisz min. 3 znaki lub kliknij...', index === 0, c.id, c.name);
            });
        } else {
            dodajWierszZLista(kontenerKategorii, pamiecKategorii, 'id-wybranej-kategorii', 'Wpisz min. 3 znaki lub kliknij...', true);
        }

        zresetujPodgladOkladki();
        document.getElementById('btn-zapisz').innerText = 'Zaktualizuj książkę';

        pokazSekcje(sekcjaDodaj);
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

if (btnOtworzModal) {
    btnOtworzModal.addEventListener('click', () => {
        modalAutor.style.display = 'flex';
    });
}

if (btnZamknijModal) {
    btnZamknijModal.addEventListener('click', () => {
        modalAutor.style.display = 'none';
    });
}

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
            wypelnijFiltrKategorii();
        })
        .catch(err => console.log('blad pobierania kategorii', err));
}

// wypelnianie elementu select w HTML danymi z API
function wypelnijFiltrKategorii() {
    if (!filtrKategorii) return;
    filtrKategorii.innerHTML = '<option value="">Wszystkie</option>';
    
    pamiecKategorii.forEach(kat => {
        const opt = document.createElement('option');
        opt.value = kat.id;
        opt.innerText = kat.name;
        filtrKategorii.appendChild(opt);
    });
}

// autocomplete logiki
function inicjalizujDynamicznePola() {
    const kontenerAutorow = document.getElementById('kontener-autorow');
    const kontenerKategorii = document.getElementById('kontener-kategorii');
    
    if (kontenerAutorow) kontenerAutorow.innerHTML = '';
    if (kontenerKategorii) kontenerKategorii.innerHTML = '';

    dodajWierszZLista(kontenerAutorow, pamiecAutorow, 'id-wybranego-autora', 'Wpisz min. 3 znaki lub kliknij...', true);
    dodajWierszZLista(kontenerKategorii, pamiecKategorii, 'id-wybranej-kategorii', 'Wpisz min. 3 znaki lub kliknij...', true);
}

function dodajWierszZLista(kontener, dane, klasaDlaId, placeholder, toPierwszy, poczatkoweId = null, poczatkowaNazwa = '') {
    if (!kontener) return;

    const wiersz = document.createElement('div');
    wiersz.className = 'dynamiczny-wiersz';

    const opakowanie = document.createElement('div');
    opakowanie.className = 'autocomplete-wrapper';

    const poleTekstowe = document.createElement('input');
    poleTekstowe.type = 'text';
    poleTekstowe.placeholder = placeholder;
    poleTekstowe.required = true;
    poleTekstowe.autocomplete = 'off';
    poleTekstowe.value = poczatkowaNazwa;

    const ukryteId = document.createElement('input');
    ukryteId.type = 'hidden';
    ukryteId.className = klasaDlaId;
    ukryteId.value = poczatkoweId || '';

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
if (formularzAutora) {
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
}

// logika ksiazek i szczegolow
let listaPobranychKsiazek = [];
let sprawdzanaKsiazkaId = null;
let sprawdzanyAutorId = null;

function pobierzKsiazki() {
    const obszar = document.getElementById('lista-ksiazek-kontener');
    if (!obszar) return;
    
    obszar.innerHTML = '<p class="pusty-stan">Ładowanie...</p>';

    let url = '/book/';
    let parametry = [];

    if (filtrKategorii && filtrKategorii.value !== '') {
        parametry.push(`categoryId=${filtrKategorii.value}`);
    }
    
    if (wyszukiwarkaKsiazek && wyszukiwarkaKsiazek.value.trim() !== '') {
        parametry.push(`name=${encodeURIComponent(wyszukiwarkaKsiazek.value.trim())}`);
    }

    if (parametry.length > 0) {
        url += '?' + parametry.join('&');
    }

    fetch(url)
        .then(res => res.json())
        .then(dane => {
            listaPobranychKsiazek = dane;
            obszar.innerHTML = '';
            
            if(dane.length === 0) {
                obszar.innerHTML = '<p class="pusty-stan">Brak książek spełniających kryteria.</p>';
                return;
            }

            dane.forEach(k => {
                const ramka = document.createElement('div');
                ramka.className = 'karta-ksiazki';
                
                let tekstAutorow = "Brak autora";
                if(k.authors && k.authors.length > 0) {
                    tekstAutorow = k.authors.map(a => `<span class="klikany-autor" onclick="skadWidokAutora = sekcjaLista; pokazDetaleAutora(${a.id}); event.stopPropagation();">${a.name}</span>`).join(', ');
                }

                let tekstKategoriiKarta = "Brak kategorii";
                if(k.categories && k.categories.length > 0) {
                    tekstKategoriiKarta = k.categories.map(c => c.name).join(', ');
                }

                ramka.innerHTML = `
                    <img src="/book/${k.id}/cover" class="karta-img" onerror="this.outerHTML='<div class=\\'karta-okladka-zastepcza\\'>Brak okładki</div>'">
                    <div class="karta-info">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h3 class="karta-tytul" style="margin-right: 10px;">${k.name}</h3>
                            <span style="background-color: #ffc107; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; white-space: nowrap;">★ ${k.rating > 0 ? k.rating + '/10' : 'Brak'}</span>
                        </div>
                        <p class="karta-autor" style="margin-bottom: 5px;">${tekstAutorow}</p>
                        <p style="font-size: 11px; color: #6a7482; margin-bottom: 5px; font-weight: 500;">Kategoria: ${tekstKategoriiKarta}</p>
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

function pobierzWszystkichAutorow() {
    const obszar = document.getElementById('lista-autorow-kontener');
    if (!obszar) return;

    obszar.innerHTML = '<p class="pusty-stan">Ładowanie autorów...</p>';

    fetch('/author/')
        .then(res => res.json())
        .then(dane => {
            pelnaListaAutorow = dane; 
            pamiecAutorow = dane; 
            renderujListeAutorow(dane);
        })
        .catch(err => {
            console.log('blad pobierania autorow', err);
            obszar.innerHTML = '<p class="pusty-stan">Błąd połączenia z serwerem.</p>';
        });
}

function renderujListeAutorow(dane) {
    const obszar = document.getElementById('lista-autorow-kontener');
    if (!obszar) return;
    
    obszar.innerHTML = '';

    if (dane.length === 0) {
        obszar.innerHTML = '<p class="pusty-stan">Brak autorów spełniających kryteria.</p>';
        return;
    }

    dane.forEach(a => {
        const ramka = document.createElement('div');
        ramka.className = 'karta-ksiazki'; 

        const bioTekst = a.biography ? a.biography : "Brak biografii.";

        ramka.innerHTML = `
            <img src="/author/${a.id}/photo" class="karta-img" style="object-fit: cover;" onerror="this.outerHTML='<div class=\\'karta-okladka-zastepcza\\' style=\\'display:flex;align-items:center;justify-content:center;background:#eaeaea;color:#888;\\'><svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' style=\\'width:40px;height:40px;\\'><circle cx=\\'12\\' cy=\\'8\\' r=\\'5\\'></circle><path d=\\'M20 21a8 8 0 0 0-16 0\\'></path></svg></div>'">
            <div class="karta-info">
                <h3 class="karta-tytul">${a.name}</h3>
                <p style="font-size: 13px; color: #555; margin-top: 5px; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.4; height: 4.2em;">${bioTekst}</p>
                <button class="btn-akcja btn-maly" onclick="skadWidokAutora = sekcjaAutorzyLista; pokazDetaleAutora(${a.id})">Szczegóły</button>
            </div>
        `;
        obszar.appendChild(ramka);
    });
}

// zapis ksiazki
const formKsiazki = document.getElementById('formularz-ksiazki');
if (formKsiazki) {
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
            name: document.getElementById('tytul').value.trim(),
            description: poleOpcjonalneOpis ? poleOpcjonalneOpis.value.trim() : "",
            bookYear: parseInt(document.getElementById('rok').value),
            authors: zebraniAutorzy,
            categories: zebraneKategorie
        };

        if (edytowanaKsiazkaId !== null) {
            ksiazkaDane.id = edytowanaKsiazkaId;
            const istniejacaKsiazka = listaPobranychKsiazek.find(k => k.id === edytowanaKsiazkaId);
            ksiazkaDane.rating = istniejacaKsiazka ? istniejacaKsiazka.rating : 0;
        } else {
            ksiazkaDane.rating = 0;
        }

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
            edytowanaKsiazkaId = null; 
            pokazSekcje(sekcjaLista);
            pobierzKsiazki();
        })
        .catch(err => {
            console.log('blad zapisu ksiazki', err);
            alert("Zapisywanie nie powiodło się! Sprawdź czy wybrałeś dane z listy.");
        });
    });
}

// detale ksiazki
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
    sprawdzanyAutorId = id;

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
            
            pobierzKsiazkiAutora(id);
        })
        .catch(err => console.log('blad pobierania danych autora', err));
}

// funkcja usuwania autora
window.usunAutora = function() {
    if (!sprawdzanyAutorId) return;

    const pytanie = confirm("Czy na pewno chcesz usunąć tego autora? Książki z nim powiązane mogą zostać zmodyfikowane.");
    
    if (pytanie) {
        fetch(`/author/${sprawdzanyAutorId}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (res.ok) {
                alert("Autor został usunięty z bazy.");
                pokazSekcje(sekcjaLista);
                pobierzKsiazki();
                pobierzDaneSlownikowe();
            } else {
                alert("Wystąpił błąd podczas usuwania. Możliwe, że serwer blokuje usunięcie z powodu przypisanych książek.");
            }
        })
        .catch(err => console.log('blad usuwania autora', err));
    }
};

// wyswietlanie listy ksiazek autora
function pobierzKsiazkiAutora(authorId) {
    const obszar = document.getElementById('lista-ksiazek-autora');
    if (!obszar) return;

    obszar.innerHTML = '<p class="pusty-stan">Ładowanie książek...</p>';

    fetch(`/book/?authorId=${authorId}`)
        .then(res => res.json())
        .then(dane => {
            obszar.innerHTML = '';
            
            if(dane.length === 0) {
                obszar.innerHTML = '<p class="pusty-stan">Brak książek tego autora w bazie.</p>';
                return;
            }

            dane.forEach(k => {
                if (!listaPobranychKsiazek.find(szukana => szukana.id === k.id)) {
                    listaPobranychKsiazek.push(k);
                }

                const ramka = document.createElement('div');
                ramka.className = 'karta-ksiazki';
                
                let tekstAutorow = "Brak autora";
                if(k.authors && k.authors.length > 0) {
                    tekstAutorow = k.authors.map(a => `<span class="klikany-autor" onclick="skadWidokAutora = sekcjaAutorSzczegoly; pokazDetaleAutora(${a.id}); event.stopPropagation();">${a.name}</span>`).join(', ');
                }

                let tekstKategoriiKarta = "Brak kategorii";
                if(k.categories && k.categories.length > 0) {
                    tekstKategoriiKarta = k.categories.map(c => c.name).join(', ');
                }

                ramka.innerHTML = `
                    <img src="/book/${k.id}/cover" class="karta-img" onerror="this.outerHTML='<div class=\\'karta-okladka-zastepcza\\'>Brak okładki</div>'">
                    <div class="karta-info">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h3 class="karta-tytul" style="margin-right: 10px;">${k.name}</h3>
                            <span style="background-color: #ffc107; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; white-space: nowrap;">★ ${k.rating > 0 ? k.rating + '/10' : 'Brak'}</span>
                        </div>
                        <p class="karta-autor" style="margin-bottom: 5px;">${tekstAutorow}</p>
                        <p style="font-size: 11px; color: #6a7482; margin-bottom: 5px; font-weight: 500;">Kategoria: ${tekstKategoriiKarta}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">Rok: ${k.bookYear}</p>
                        <button class="btn-akcja btn-maly" onclick="pokazDetale(${k.id})">Szczegóły</button>
                    </div>
                `;
                obszar.appendChild(ramka);
            });
        })
        .catch(err => {
            console.log('blad pobierania ksiazek autora', err);
            obszar.innerHTML = '<p class="pusty-stan">Błąd ładowania książek.</p>';
        });
}

// pobieranie i wyswietlanie recenzji
function odswiezRecenzje(ksiazkaId) {
    const obszarRecenzji = document.getElementById('lista-recenzji');
    if (!obszarRecenzji) return;
    
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

            let sumaOcen = 0;
            let liczbaOcen = 0;

            function renderujDrzewo(lista, kontener, poziom = 0, nazwaRodzica = null) {
                lista.forEach(r => {
                    if (poziom === 0 && r.grade > 0) {
                        sumaOcen += r.grade;
                        liczbaOcen++;
                    }

                    const klocek = document.createElement('div');
                    klocek.className = 'karta-recenzji';
                    
                    if (poziom > 0) {
                        klocek.classList.add('karta-recenzji-wciecie');
                        klocek.style.marginLeft = `${poziom * 30}px`;
                    }

                    const znaczekOceny = r.grade > 0 
                        ? `<span class="recenzja-ocena">${r.grade}/10</span>` 
                        : `<span class="recenzja-ocena-odpowiedz">Odpowiedź</span>`;

                    const wyswietlanaNazwa = (poziom > 0 && nazwaRodzica) 
                        ? `${r.userName} <span style="color: #6a7482; font-size: 13px; font-weight: normal; margin-left: 5px;">&rarr; ${nazwaRodzica}</span>`
                        : r.userName;

                    klocek.innerHTML = `
                        <div class="recenzja-naglowek">
                            <span class="recenzja-autor">${wyswietlanaNazwa}</span>
                            ${znaczekOceny}
                        </div>
                        <div class="recenzja-tekst">"${r.reviewText}"</div>
                        
                        <div style="margin-top: 10px;">
                            <button type="button" class="btn-link" onclick="pokazFormularzOdpowiedzi(${r.id}, this)">Odpowiedz</button>
                            <button type="button" class="btn-link" style="color: #dc3545; margin-left: 15px;" onclick="usunRecenzje(${r.id})">Usuń</button>
                        </div>
                        
                        <div class="formularz-odpowiedzi" style="display: none; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #eaeaea;">
                            <form onsubmit="wyslijOdpowiedz(event, ${r.id})">
                                <input type="text" class="odp-autor" placeholder="Twoje imię / nick" required style="width: 100%; box-sizing: border-box; margin-bottom: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <textarea class="odp-tekst" rows="2" placeholder="Napisz odpowiedź..." required style="width: 100%; box-sizing: border-box; margin-bottom: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
                                <button type="submit" class="btn-akcja btn-maly" style="width: auto;">Wyślij odpowiedź</button>
                            </form>
                        </div>
                    `;
                    
                    kontener.appendChild(klocek);

                    if (r.children && r.children.length > 0) {
                        renderujDrzewo(r.children, kontener, poziom + 1, r.userName);
                    }
                });
            }

            renderujDrzewo(dane, obszarRecenzji);

            if (liczbaOcen > 0) {
                const wyliczonaSrednia = (sumaOcen / liczbaOcen).toFixed(1);
                document.getElementById('detale-ocena').innerText = `${wyliczonaSrednia}/10`;
            } else {
                document.getElementById('detale-ocena').innerText = "Brak ocen";
            }
        })
        .catch(err => {
            console.log('blad ladowania recenzji', err);
            obszarRecenzji.innerHTML = '<p class="pusty-stan">Błąd ładowania recenzji.</p>';
        });
}

// usuwanie pojedynczej recenzji
window.usunRecenzje = function(id) {
    const pytanie = confirm("Czy na pewno chcesz usunąć tę recenzję/odpowiedź?");
    
    if (pytanie) {
        fetch(`/book-review/${id}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (res.ok) {
                alert("Recenzja została usunięta.");
                odswiezRecenzje(sprawdzanaKsiazkaId);
                pobierzKsiazki(); 
            } else {
                alert("Wystąpił błąd podczas usuwania recenzji.");
            }
        })
        .catch(err => console.log('blad usuwania recenzji', err));
    }
};

// formularz odpowiedzi
window.pokazFormularzOdpowiedzi = function(id, przycisk) {
    const kontener = przycisk.parentElement.nextElementSibling;
    if (kontener.style.display === 'none') {
        kontener.style.display = 'block';
        przycisk.innerText = 'Anuluj';
    } else {
        kontener.style.display = 'none';
        przycisk.innerText = 'Odpowiedz';
    }
};

window.wyslijOdpowiedz = function(e, parentId) {
    e.preventDefault();
    if(!sprawdzanaKsiazkaId) return;

    const formularz = e.target;
    
    const odpowiedzDane = {
        book: { id: sprawdzanaKsiazkaId },
        userName: formularz.querySelector('.odp-autor').value.trim(),
        grade: 0,
        reviewText: formularz.querySelector('.odp-tekst').value.trim(),
        children: []
    };

    fetch(`/book-review/save?parentId=${parentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(odpowiedzDane)
    })
    .then(async res => {
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Błąd serwera:", errorText);
            throw new Error(errorText);
        }
        return res.json();
    })
    .then(() => {
        odswiezRecenzje(sprawdzanaKsiazkaId);
        pobierzKsiazki(); 
    })
    .catch(err => {
        console.log('blad zapisu odpowiedzi', err);
        alert("Błąd podczas dodawania odpowiedzi. Sprawdź konsolę.");
    });
};

// zapis nowej recenzji do bazy
const formRecenzja = document.getElementById('formularz-recenzji');
if (formRecenzja) {
    formRecenzja.addEventListener('submit', (e) => {
        e.preventDefault();
        if(!sprawdzanaKsiazkaId) return;

        const recenzjaDane = {
            book: { id: sprawdzanaKsiazkaId },
            userName: document.getElementById('recenzja-autor').value.trim(),
            grade: parseInt(document.getElementById('recenzja-ocena').value),
            reviewText: document.getElementById('recenzja-tekst').value.trim(),
            children: [] 
        };

        fetch('/book-review/save?parentId=', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recenzjaDane)
        })
        .then(async res => {
            if (!res.ok) {
                const errorText = await res.text();
                console.error("Błąd serwera:", errorText);
                throw new Error(errorText);
            }
            return res.json();
        })
        .then(() => {
            formRecenzja.reset();
            odswiezRecenzje(sprawdzanaKsiazkaId);
            pobierzKsiazki(); 
        })
        .catch(err => {
            console.log('blad zapisu recenzji', err);
            alert("Nie udało się dodać recenzji. Sprawdź konsolę.");
        });
    });
}

// usuwanie ksiazki
const przyciskUsun = document.getElementById('btn-usun-ksiazke');
if (przyciskUsun) {
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
}
pokazSekcje(sekcjaLista);
pobierzDaneSlownikowe();
pobierzKsiazki();