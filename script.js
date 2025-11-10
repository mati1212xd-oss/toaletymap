// --- Inicjalizacja Mapy ---
// Ustawia mapę na środku kampusu (zmień koordynaty na swoje)
// Obliczyłem nowy środek na podstawie Twoich pinezek
const mapCenter = [52.213, 20.987]; // [szerokość, długość]
const initialZoom = 15; // Zmniejszyłem zoom, aby objąć wszystkie punkty

// Inicjalizujemy mapę w naszym divie #map
const map = L.map('map').setView(mapCenter, initialZoom);

// Dodajemy "kafelki" mapy - czyli sam wygląd mapy. Używamy darmowych OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- Baza Danych Toalet ---
// Twoje dane, które podałeś:
const toalety = [
    {
        lat: 52.2078559642937,
        lng: 20.985786707695123,
        nazwa: 'UCS - parter lewe skrzydło',
        opis: 'Dużo toalet 1-osobowych nowoczesnych. Na ostatnim piętrze duże toalety wieloosobowe.',
        zdjecie: 'images/UCS1.jpg',
        ocena: 4
    },
    {
        lat: 52.20820427646147,
        lng: 20.979830088093806,
        nazwa: 'CSM',
        opis: 'Duże toalety w szatniach w podziemiach, brak ludzi i brak zasięgu. Na 2 piętrze też spoko.',
        zdjecie: 'images/CSM.jpg',
        ocena: 4
    },
    {
        lat: 52.205868532657604,
        lng: 20.981562853951694,
        nazwa: 'CSR',
        opis: 'Fajne toalety, dużo ich na każdym piętrze, mało ludzi, ale otwarte.',
        zdjecie: 'images/placeholder.jpg', // Domyślne zdjęcie
        ocena: 5
    },
    {
        lat: 52.20594085661789,
        lng: 20.984465004146944,
        nazwa: 'CD',
        opis: 'Jedna na lewo od wejścia, druga na -1 przy windach. Słabe, dużo ludzi.',
        zdjecie: 'images/placeholder.jpg', // Domyślne zdjęcie
        ocena: 1
    },
    {
        lat: 52.20774234274788,
        lng: 20.980468512641032,
        nazwa: 'Zakład Patomorfologii',
        opis: 'Dobra toaleta na 3 piętrze.',
        zdjecie: 'images/placeholder.jpg', // Domyślne zdjęcie
        ocena: 3
    },
    {
        lat: 52.209846175718916,
        lng: 20.986074329551887,
        nazwa: 'Farmacja',
        opis: 'Słabe, średniowieczne toalety w piwnicach.',
        zdjecie: 'images/placeholder.jpg', // Domyślne zdjęcie
        ocena: 2
    },
    {
        lat: 52.22506344729113,
        lng: 20.9983348485012,
        nazwa: 'Okulistyka',
        opis: 'Totalny PRL, spłukiwanie sznurkiem zwisającym z góry. Jedna w szatni studenckiej w podziemiach, druga na wprost od recepcji od wejścia. Jednoosobowe, ta koło recepcji lepsza.',
        zdjecie: 'images/Okulistyka.jpg',
        ocena: 3
    },
    {
        lat: 52.23423239446239,
        lng: 20.972576939699074,
        nazwa: 'Szpital Wolska',
        opis: 'Bardzo fajne toalety na 1 piętrze w budynku gdzie są sale seminaryjne, mało ludzi. Fajna toaleta na prawo za szatnią w budynku szpitala.',
        zdjecie: 'images/placeholder.jpg', // Domyślne zdjęcie
        ocena: 5
    },
    {
        lat: 52.21707823174565,
        lng: 21.02041209833766,
        nazwa: 'Kampus Litewska',
        opis: 'Dobre, nowoczesne toalety na każdym piętrze, dosyć mało ludzi.',
        zdjecie: 'images/placeholder.jpg', // Domyślne zdjęcie
        ocena: 4
    },
    {
        // --- NOWY WPIS DODANY TUTAJ ---
        lat: 52.22509853510605,
        lng: 21.003075108792096,
        nazwa: 'Collegium Anatomicum',
        opis: 'Duża, bardzo duży ruch, dużo ludzi, nieprzyjemna.',
        zdjecie: 'images/anatomicum.jpg',
        ocena: 1
    }
];

// --- Funkcja do generowania gwiazdek ---
// Zmienia liczbę (np. 4) na gwiazdki (np. ★★★★☆)
function stworzGwiazdki(ocena) {
    let gwiazdki = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= ocena) {
            gwiazdki += '★'; // Wypełniona gwiazdka
        } else {
            gwiazdki += '☆'; // Pusta gwiazdka
        }
    }
    return gwiazdki;
}

// --- Dodawanie Pinezek (Markerów) na Mapę ---
toalety.forEach(toaleta => {
    // Tworzymy treść okienka popup w HTML
    const popupHTML = `
        <div class="popup-content">
            <h3>${toaleta.nazwa}</h3>
            <img src="${toaleta.zdjecie}" alt="Zdjęcie toalety: ${toaleta.nazwa}">
            <p>${toaleta.opis}</p>
            <div class="star-rating" title="Ocena: ${toaleta.ocena}/5">
                ${stworzGwiazdki(toaleta.ocena)}
            </div>
        </div>
    `;

    // Tworzymy pinezkę (marker) i dodajemy ją do mapy
    L.marker([toaleta.lat, toaleta.lng])
        .addTo(map)
        .bindPopup(popupHTML); // Dodajemy okienko popup do pinezki
});