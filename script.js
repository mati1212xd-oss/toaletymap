// --- Inicjalizacja Mapy ---
const mapCenter = [52.213, 20.987]; 
const initialZoom = 15; 

const map = L.map('map').setView(mapCenter, initialZoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- Baza Danych Toalet ---
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
        zdjecie: 'images/placeholder.jpg',
        ocena: 5
    },
    {
        lat: 52.20594085661789,
        lng: 20.984465004146944,
        nazwa: 'CD',
        opis: 'Jedna na lewo od wejścia, druga na -1 przy windach. Słabe, dużo ludzi.',
        zdjecie: 'images/placeholder.jpg', 
        ocena: 1
    },
    {
        lat: 52.20774234274788,
        lng: 20.980468512641032,
        nazwa: 'Zakład Patomorfologii',
        opis: 'Dobra toaleta na 3 piętrze.',
        zdjecie: 'images/placeholder.jpg',
        ocena: 3
    },
    {
        lat: 52.209846175718916,
        lng: 20.986074329551887,
        nazwa: 'Farmacja',
        opis: 'Słabe, średniowieczne toalety w piwnicach.',
        zdjecie: 'images/placeholder.jpg',
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
        zdjecie: 'images/placeholder.jpg',
        ocena: 5
    },
    {
        lat: 52.21707823174565,
        lng: 21.02041209833766,
        nazwa: 'Kampus Litewska',
        opis: 'Dobre, nowoczesne toalety na każdym piętrze, dosyć mało ludzi.',
        zdjecie: 'images/placeholder.jpg',
        ocena: 4
    },
    {
        lat: 52.22509853510605,
        lng: 21.003075108792096,
        nazwa: 'Collegium Anatomicum',
        opis: 'Duża, bardzo duży ruch, dużo ludzi, nieprzyjemna.',
        zdjecie: 'images/anatomicum.jpg',
        ocena: 1
    }
];

// --- Funkcja do generowania gwiazdek ---
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

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${toaleta.lat},${toaleta.lng}`;

    const popupHTML = `
        <div class="popup-content">
            <h3>${toaleta.nazwa}</h3>
            <img src="${toaleta.zdjecie}" alt="Zdjęcie toalety: ${toaleta.nazwa}">
            <p>${toaleta.opis}</p>
            
            <a href="${googleMapsUrl}" target="_blank" class="nav-link">
                Nawiguj do toalety
            </a>

            <div class="star-rating" title="Ocena: ${toaleta.ocena}/5">
                ${stworzGwiazdki(toaleta.ocena)} (${toaleta.ocena}/5)
            </div>
        </div>
    `;

    L.marker([toaleta.lat, toaleta.lng])
        .addTo(map)
        .bindPopup(popupHTML);
});


// -----------------------------------------------------------------
// --- 📍 NOWA SEKCJA: LOKALIZACJA UŻYTKOWNIKA ---
// -----------------------------------------------------------------

// Zmienne do przechowywania kropki i okręgu dokładności
let userLocationMarker = null;
let userAccuracyCircle = null;

// Funkcja wywoływana, gdy lokalizacja zostanie znaleziona
function onLocationFound(e) {
    const radius = e.accuracy; // Dokładność w metrach

    // Style dla naszej kropki i okręgu
    const locationMarkerStyle = {
        color: '#0078FF',
        fillColor: '#0078FF',
        fillOpacity: 0.8, // Bardziej widoczna kropka
        radius: 8, // Rozmiar kropki
        weight: 2 // Obwódka
    };
    const accuracyCircleStyle = {
        color: '#0078FF',
        fillColor: '#0078FF',
        fillOpacity: 0.15, // Lekko przezroczysty okrąg
        weight: 1,
        interactive: false // Nie da się kliknąć okręgu
    };

    if (!userLocationMarker) {
        // Jeśli to pierwsze znalezienie lokalizacji:
        // 1. Stwórz kropkę (używamy circleMarker, bo to kropka, a nie pinezka)
        userLocationMarker = L.circleMarker(e.latlng, locationMarkerStyle).addTo(map)
            .bindPopup("Jesteś tutaj").openPopup();
        
        // 2. Stwórz okrąg dokładności
        userAccuracyCircle = L.circle(e.latlng, radius, accuracyCircleStyle).addTo(map);
        
        // 3. Ustaw widok mapy na lokalizację użytkownika
        map.setView(e.latlng, 17); // Ustawia zoom na 17
    } else {
        // Jeśli to aktualizacja (bo `watch: true`):
        // 1. Przesuń kropkę
        userLocationMarker.setLatLng(e.latlng);
        // 2. Przesuń i zmień rozmiar okręgu
        userAccuracyCircle.setLatLng(e.latlng).setRadius(radius);
    }
}

// Funkcja wywoływana, gdy wystąpi błąd (np. użytkownik nie pozwoli)
function onLocationError(e) {
    alert("Nie można pobrać lokalizacji. \nUpewnij się, że zezwoliłeś na dostęp w przeglądarce i masz włączony GPS.");
}

// Podpięcie funkcji do eventów mapy
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Uruchomienie śledzenia lokalizacji
// `watch: true` oznacza śledzenie na żywo (kropka będzie się przesuwać)
map.locate({ watch: true, setView: false, maxZoom: 17 });
