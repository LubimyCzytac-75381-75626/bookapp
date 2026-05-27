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