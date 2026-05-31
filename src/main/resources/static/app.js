// elementy nawigacji
const btnLista = document.getElementById('btn-lista');
const btnDodaj = document.getElementById('btn-dodaj');
const btnPowrot = document.getElementById('btn-powrot');

// sekcje i ekrany
const sekcjaLista = document.getElementById('sekcja-lista');
const sekcjaDodaj = document.getElementById('sekcja-dodaj');
const sekcjaSzczegoly = document.getElementById('sekcja-szczegoly');

// logika przełączania ekranów
function pokazSekcje(sekcjaDoPokazania) {
    sekcjaLista.style.display = 'none';
    sekcjaDodaj.style.display = 'none';
    sekcjaSzczegoly.style.display = 'none';

    sekcjaDoPokazania.style.display = 'block';
}

// przypinamy zdarzenia kliknięcia
btnLista.addEventListener('click', () => pokazSekcje(sekcjaLista));
btnDodaj.addEventListener('click', () => pokazSekcje(sekcjaDodaj));
btnPowrot.addEventListener('click', () => pokazSekcje(sekcjaLista));

// tymczasowa baza danych ze wsparciem wielu autorow
let ksiazkiMock = [
    { id: 1, tytul: "Wiedźmin: Ostatnie życzenie", autorzy: ["Andrzej Sapkowski"], opis: "Zbiór opowiadań o wiedźminie Geralcie z Rivii." },
    { id: 2, tytul: "Dobry Omen", autorzy: ["Terry Pratchett", "Neil Gaiman"], opis: "Humorystyczna powieść o zbliżającym się końcu świata." },
    { id: 3, tytul: "Diuna", autorzy: ["Frank Herbert"], opis: "Epicka opowieść o pustynnej planecie Arrakis." }
];

// rysowanie kart na stronie
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

        const listaAutorowTekst = ksiazka.autorzy.join(', ');

        karta.innerHTML = `
            <div class="karta-okladka">Brak okładki</div>
            <div class="karta-info">
                <h3 class="karta-tytul">${ksiazka.tytul}</h3>
                <p class="karta-autor">${listaAutorowTekst}</p>
                <button class="btn-akcja btn-maly" onclick="pokazSzczegoly(${ksiazka.id})">Szczegóły</button>
            </div>
        `;
        kontener.appendChild(karta);
    });
}

// detale ksiazki
function pokazSzczegoly(id) {
    const ksiazka = ksiazkiMock.find(k => k.id === id);

    if (ksiazka) {
        document.getElementById('detale-tytul').innerText = ksiazka.tytul;
        document.getElementById('detale-autor').innerText = ksiazka.autorzy.join(', ');
        document.getElementById('detale-opis').innerText = ksiazka.opis;

        pokazSekcje(sekcjaSzczegoly);
    }
}

// dodawanie nowych pol dla kolejnych autorow
const btnDodajAutora = document.getElementById('btn-dodaj-autora');
const kontenerAutorow = document.getElementById('kontener-autorow');

btnDodajAutora.addEventListener('click', () => {
    const nowyDiv = document.createElement('div');
    nowyDiv.className = 'pole-autora';
    
    const nowyInput = document.createElement('input');
    nowyInput.type = 'text';
    nowyInput.className = 'input-autor';
    nowyInput.placeholder = 'Kolejny autor...';
    
    nowyDiv.appendChild(nowyInput);
    kontenerAutorow.appendChild(nowyDiv);
});

// obsluga formularza
const formularz = document.getElementById('formularz-ksiazki');

formularz.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const inputyAutorow = document.querySelectorAll('.input-autor');
    const zebraniAutorzy = [];

    inputyAutorow.forEach(input => {
        const wartosc = input.value.trim();
        if (wartosc !== '') {
            zebraniAutorzy.push(wartosc);
        }
    });

    const nowaKsiazka = {
        id: Date.now(), 
        tytul: document.getElementById('tytul').value.trim(),
        autorzy: zebraniAutorzy,
        opis: document.getElementById('opis').value.trim()
    };

    ksiazkiMock.push(nowaKsiazka);

    formularz.reset(); 
    
    const wszystkiePola = document.querySelectorAll('.pole-autora');
    for (let i = 1; i < wszystkiePola.length; i++) {
        wszystkiePola[i].remove();
    }
    
    renderujListeKsiazek();
    pokazSekcje(sekcjaLista); 
});

renderujListeKsiazek();