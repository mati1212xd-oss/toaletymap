// === INICJALIZACJA MAPY ===
const mapCenter = [52.213, 20.987]; 
const initialZoom = 15; 
const map = L.map('map').setView(mapCenter, initialZoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// === GLOBALNE ZMIENNE ===
let allMarkers = []; // Przechowamy tu wszystkie pinezki (dla filtrów)
let userCurrentLocation = null; // Przechowamy tu lokalizację użytkownika (dla "znajdź najbliższą")


// === BAZA DANYCH TOALET (uproszczona) ===
const toalety = [
    {
        lat: 52.2078559642937, lng: 20.985786707695123,
        nazwa: 'UCS - parter lewe skrzydło',
        opis: 'Dużo toalet 1-osobowych nowoczesnych. Na ostatnim piętrze duże toalety wieloosobowe.',
        zdjecie: 'images/UCS1.jpg', ocena: 4
    },
    {
        lat: 52.20820427646147, lng: 20.979830088093806,
        nazwa: 'CSM',
        opis: 'Duże toalety w szatniach w podziemiach, brak ludzi i brak zasięgu. Na 2 piętrze też spoko.',
        zdjecie: 'images/CSM.jpg', ocena: 4
    },
    {
        lat: 52.205868532657604, lng: 20.981562853951694,
        nazwa: 'CSR',
        opis: 'Fajne toalety, dużo ich na każdym piętrze, mało ludzi, ale otwarte.',
        zdjecie: 'images/placeholder.jpg', ocena: 5
    },
    {
        lat: 52.20594085661789, lng: 20.984465004146944,
        nazwa: 'CD',
        opis: 'Jedna na lewo od wejścia, druga na -1 przy windach. Słabe, dużo ludzi.',
        zdjecie: 'images/placeholder.jpg', ocena: 1
    },
    {
        lat: 52.20774234274788, lng: 20.980468512641032,
        nazwa: 'Zakład Patomorfologii',
        opis: 'Dobra toaleta na 3 piętrze.',
        zdjecie: 'images/placeholder.jpg', ocena: 3
    },
    {
        lat: 52.209846175718916, lng: 20.986074329551887,
        nazwa: 'Farmacja',
        opis: 'Słabe, średniowieczne toalety w piwnicach.',
        zdjecie: 'images/placeholder.jpg', ocena: 2
    },
    {
        lat: 52.22506344729113, lng: 20.9983348485012,
        nazwa: 'Okulistyka',
        opis: 'Totalny PRL... Jednoosobowe...',
        zdjecie: 'images/Okulistyka.jpg', ocena: 3
    },
    {
        lat: 52.23423239446239, lng: 20.972576939699074,
        nazwa: 'Szpital Wolska',
        opis: 'Bardzo fajne toalety na 1 piętrze... Fajna toaleta na prawo za szatnią...',
        zdjecie: 'images/placeholder.jpg', ocena: 5
    },
    {
        lat: 52.21707823174565, lng: 21.02041209833766,
        nazwa: 'Kampus Litewska',
        opis: 'Dobre, nowoczesne toalety na każdym piętrze, dosyć mało ludzi.',
        zdjecie: 'images/placeholder.jpg', ocena: 4
    },
    {
        lat: 52.22509853510605, lng: 21.003075108792096,
        nazwa: 'Collegium Anatomicum',
        opis: 'Duża, bardzo duży ruch, dużo ludzi, nieprzyjemna.',
        zdjecie: 'images/anatomicum.jpg', ocena: 1
    }
];

// === FUNKCJE POMOCNICZE ===

// Funkcja do gwiazdek
function stworzGwiazdki(ocena) {
    let gwiazdki = '';
    for (let i = 1; i <= 5; i++) {
        gwiazdki += (i <= ocena) ? '★' : '☆';
    }
    return gwiazdki;
}

// --- Funkcja zwracająca kolorową ikonę ---
function getIcon(ocena) {
    let iconColor;
    if (ocena >= 5) {
        iconColor = 'green'; // 5 gwiazdek
    } else if (ocena >= 3) {
        iconColor = 'orange'; // 3-4 gwiazdki
    } else {
        iconColor = 'red'; // 1-2 gwiazdki
    }

    return L.AwesomeMarkers.icon({
        icon: 'map-marker', // Zmieniona ikona na ogólną
        markerColor: iconColor,
        prefix: 'fa'
    });
}

// === TWORZENIE MARKERÓW ===
toalety.forEach(toaleta => {
    // 1. Stwórz HTML dla okienka popup
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${toaleta.lat},${toaleta.lng}`;
    const popupHTML = `
        <div class="popup-content">
            <h3>${toaleta.nazwa}</h3>
            <img src="${toaleta.zdjecie}" alt="Zdjęcie toalety: ${toaleta.nazwa}">
            <p>${toaleta.opis}</p>
            <a href="${googleMapsUrl}" target="_blank" class="nav-link">Nawiguj do toalety</a>
            <div class="rating-container" title="Ocena: ${toaleta.ocena}/5">
                <span class="star-rating">${stworzGwiazdki(toaleta.ocena)}</span>
                <span class="rating-text">(${toaleta.ocena}/5)</span>
            </div>
        </div>
    `;

    // 2. Stwórz marker z kolorową ikoną
    const marker = L.marker([toaleta.lat, toaleta.lng], {
        icon: getIcon(toaleta.ocena) 
    })
    .bindPopup(popupHTML)
    .addTo(map);

    // 3. Dodaj dane toalety do obiektu markera (ważne dla filtrów!)
    marker.toaletaData = toaleta;

    // 4. Zapisz marker w globalnej tablicy
    allMarkers.push(marker);
});


// === LOGIKA DLA NOWYCH FUNKCJI ===

// --- Logika filtrowania (Uproszczona) ---
const filterCheckboxes = document.querySelectorAll('.filter-check');

function updateFilters() {
    const filter5star = document.getElementById('filter-5star').checked;

    allMarkers.forEach(marker => {
        const data = marker.toaletaData;
        let show = true; // Domyślnie pokaż

        // Sprawdź filtr 5 gwiazdek
        if (filter5star && data.ocena < 5) {
            show = false;
        }

        // Pokaż lub ukryj marker
        if (show) {
            marker.addTo(map);
        } else {
            marker.removeFrom(map);
        }
    });
}

// Nasłuchuj zmian na każdym checkboxie
filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateFilters);
});


// --- Logika przycisku "Znajdź najbliższą" ---
document.getElementById('find-nearest').addEventListener('click', () => {
    if (!userCurrentLocation) {
        alert("Nie można znaleźć Twojej lokalizacji. Upewnij się, że zezwoliłeś na dostęp.");
        return;
    }

    let closestMarker = null;
    let minDistance = Infinity;

    allMarkers.forEach(marker => {
        if (map.hasLayer(marker)) { 
            const distance = userCurrentLocation.distanceTo(marker.getLatLng());
            
            if (distance < minDistance) {
                minDistance = distance;
                closestMarker = marker;
            }
        }
    });

    if (closestMarker) {
        map.setView(closestMarker.getLatLng(), 18); // Przybliż na maxa
        closestMarker.openPopup();
    } else {
        alert("Brak pasujących toalet na mapie. Spróbuj wyłączyć filtry.");
    }
});


// --- SEKCJA LOKALIZACJI UŻYTKOWNIKA ---
let userLocationMarker = null;
let userAccuracyCircle = null;

function onLocationFound(e) {
    const radius = e.accuracy; 
    userCurrentLocation = e.latlng; 

    const locationMarkerStyle = {
        color: '#0078FF', fillColor: '#0078FF', fillOpacity: 0.8, radius: 8, weight: 2
    };
    const accuracyCircleStyle = {
        color: '#0078FF', fillColor: '#0078FF', fillOpacity: 0.15, weight: 1, interactive: false
    };

    if (!userLocationMarker) {
        userLocationMarker = L.circleMarker(e.latlng, locationMarkerStyle).addTo(map)
            .bindPopup("Jesteś tutaj").openPopup();
        userAccuracyCircle = L.circle(e.latlng, radius, accuracyCircleStyle).addTo(map);
        map.setView(e.latlng, 17); 
    } else {
        userLocationMarker.setLatLng(e.latlng);
        userAccuracyCircle.setLatLng(e.latlng).setRadius(radius);
    }
}

function onLocationError(e) {
    alert("Nie można pobrać lokalizacji. \nUpewnij się, że zezwoliłeś na dostęp w przeglądarce i masz włączony GPS.");
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({ watch: true, setView: false, maxZoom: 17 });
