// === INICJALIZACJA MAPY ===
const mapCenter = [52.213, 20.987]; 
const initialZoom = 15; 
const map = L.map('map').setView(mapCenter, initialZoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// === GLOBALNE ZMIENNE ===
let allMarkers = []; 
let userCurrentLocation = null; 
let currentLang = 'pl'; 

// === SŁOWNIK TŁUMACZEŃ ===
const translations = {
    pl: {
        title: "Mapa Toalet na WUM",
        filter_title: "Filtruj wyniki",
        filter_best: "Tylko najlepsze (5 ★)",
        btn_nearest: "📍 Znajdź najbliższą",
        btn_report: "+ Zgłoś nową",
        nav_btn: "Nawiguj do toalety",
        rating_prefix: "Ocena"
    },
    en: {
        title: "WUM Toilet Map",
        filter_title: "Filter results",
        filter_best: "Best rated only (5 ★)",
        btn_nearest: "📍 Find nearest",
        btn_report: "+ Report new",
        nav_btn: "Navigate to toilet",
        rating_prefix: "Rating"
    }
};

// === BAZA DANYCH TOALET ===
const toalety = [
    {
        lat: 52.2078559642937, lng: 20.985786707695123,
        nazwa: { pl: 'UCS - parter lewe skrzydło', en: 'UCS - Ground floor left wing' },
        opis: { 
            pl: 'Dużo toalet 1-osobowych nowoczesnych. Na ostatnim piętrze duże toalety wieloosobowe.',
            en: 'Many modern single-person toilets. Large multi-person toilets on the top floor.'
        },
        zdjecie: 'images/UCS1.jpg', ocena: 4
    },
    {
        lat: 52.20820427646147, lng: 20.979830088093806,
        nazwa: { pl: 'CSM', en: 'CSM' },
        opis: { 
            pl: 'Duże toalety w szatniach w podziemiach, brak ludzi i brak zasięgu. Na 2 piętrze też spoko.',
            en: 'Large toilets in basement locker rooms, no people and no signal. 2nd floor is also okay.'
        },
        zdjecie: 'images/CSM.jpg', ocena: 4
    },
    {
        lat: 52.205868532657604, lng: 20.981562853951694,
        nazwa: { pl: 'CSR', en: 'CSR' },
        opis: { 
            pl: 'Fajne toalety, dużo ich na każdym piętrze, mało ludzi, ale otwarte.',
            en: 'Nice toilets, plenty on every floor, few people, but open.'
        },
        zdjecie: 'images/placeholder.jpg', ocena: 5
    },
    {
        lat: 52.20594085661789, lng: 20.984465004146944,
        nazwa: { pl: 'CD', en: 'CD' },
        opis: { 
            pl: 'Jedna na lewo od wejścia, druga na -1 przy windach. Słabe, dużo ludzi.',
            en: 'One to the left of the entrance, another on level -1 by the elevators. Poor quality, crowded.'
        },
        zdjecie: 'images/placeholder.jpg', ocena: 1
    },
    {
        lat: 52.20774234274788, lng: 20.980468512641032,
        nazwa: { pl: 'Zakład Patomorfologii', en: 'Pathomorphology Dept.' },
        opis: { 
            pl: 'Dobra toaleta na 3 piętrze.',
            en: 'Good toilet on the 3rd floor.'
        },
        zdjecie: 'images/placeholder.jpg', ocena: 3
    },
    {
        lat: 52.209846175718916, lng: 20.986074329551887,
        nazwa: { pl: 'Farmacja', en: 'Pharmacy Faculty' },
        opis: { 
            pl: 'Słabe, średniowieczne toalety w piwnicach.',
            en: 'Poor, medieval-style toilets in the basement.'
        },
        zdjecie: 'images/placeholder.jpg', ocena: 2
    },
    {
        lat: 52.22506344729113, lng: 20.9983348485012,
        nazwa: { pl: 'Okulistyka', en: 'Ophthalmology' },
        opis: { 
            pl: 'Totalny PRL, spłukiwanie sznurkiem zwisającym z góry. Jedna w szatni studenckiej w podziemiach...',
            en: 'Total communist era style, flush with a hanging string. One in the student locker room in the basement...'
        },
        zdjecie: 'images/Okulistyka.jpg', ocena: 3
    },
    {
        lat: 52.23423239446239, lng: 20.972576939699074,
        nazwa: { pl: 'Szpital Wolska', en: 'Wolska Hospital' },
        opis: { 
            pl: 'Bardzo fajne toalety na 1 piętrze w budynku gdzie są sale seminaryjne, mało ludzi...',
            en: 'Very nice toilets on the 1st floor in the seminar rooms building, few people...'
        },
        zdjecie: 'images/placeholder.jpg', ocena: 5
    },
    {
        lat: 52.21707823174565, lng: 21.02041209833766,
        nazwa: { pl: 'Kampus Litewska', en: 'Litewska Campus' },
        opis: { 
            pl: 'Dobre, nowoczesne toalety na każdym piętrze, dosyć mało ludzi.',
            en: 'Good, modern toilets on every floor, not too crowded.'
        },
        zdjecie: 'images/placeholder.jpg', ocena: 4
    },
    {
        lat: 52.22509853510605, lng: 21.003075108792096,
        nazwa: { pl: 'Collegium Anatomicum', en: 'Collegium Anatomicum' },
        opis: { 
            pl: 'Duża, bardzo duży ruch, dużo ludzi, nieprzyjemna.',
            en: 'Large, very busy, crowded, unpleasant.'
        },
        zdjecie: 'images/anatomicum.jpg', ocena: 1
    }
];

// === FUNKCJE POMOCNICZE ===
function stworzGwiazdki(ocena) {
    let gwiazdki = '';
    for (let i = 1; i <= 5; i++) {
        gwiazdki += (i <= ocena) ? '★' : '☆';
    }
    return gwiazdki;
}

function getIcon(ocena) {
    let iconColor;
    if (ocena >= 5) iconColor = 'green';
    else if (ocena >= 3) iconColor = 'orange';
    else iconColor = 'red';

    return L.AwesomeMarkers.icon({
        icon: 'map-marker',
        markerColor: iconColor,
        prefix: 'fa'
    });
}

// === LOGIKA RENDEROWANIA MAPY ===
function renderMarkers() {
    allMarkers.forEach(marker => map.removeLayer(marker));
    allMarkers = [];

    toalety.forEach(toaleta => {
        const nazwa = toaleta.nazwa[currentLang];
        const opis = toaleta.opis[currentLang];
        const navBtnText = translations[currentLang].nav_btn;
        const ratingText = translations[currentLang].rating_prefix;

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${toaleta.lat},${toaleta.lng}`;
        
        const popupHTML = `
            <div class="popup-content">
                <h3>${nazwa}</h3>
                <img src="${toaleta.zdjecie}" alt="Zdjęcie: ${nazwa}">
                <p>${opis}</p>
                <a href="${googleMapsUrl}" target="_blank" class="nav-link">${navBtnText}</a>
                <div class="rating-container" title="${ratingText}: ${toaleta.ocena}/5">
                    <span class="star-rating">${stworzGwiazdki(toaleta.ocena)}</span>
                    <span class="rating-text">(${toaleta.ocena}/5)</span>
                </div>
            </div>
        `;

        // PRZYWRÓCONA WERSJA: .bindPopup(popupHTML) bez dodatkowych opcji
        const marker = L.marker([toaleta.lat, toaleta.lng], {
            icon: getIcon(toaleta.ocena) 
        }).bindPopup(popupHTML);

        marker.toaletaData = toaleta;

        marker.on('popupopen', function(e) {
            const popup = e.popup;
            setTimeout(() => {
                const img = popup.getElement()?.querySelector('.popup-content img');
                if (img) {
                    if (img.complete) {
                        popup.update();
                    } else {
                        img.onload = () => {
                            popup.update();
                        };
                    }
                }
            }, 10); 
        });

        allMarkers.push(marker);
    });

    updateFilters();
}

// === ZMIANA JĘZYKA ===
function setLanguage(lang) {
    currentLang = lang;
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });

    renderMarkers();

    const btn = document.getElementById('lang-switch');
    if (lang === 'pl') {
        btn.innerText = '🇬🇧 Switch to English';
    } else {
        btn.innerText = '🇵🇱 Zmień na Polski';
    }
}

document.getElementById('lang-switch').addEventListener('click', () => {
    const newLang = (currentLang === 'pl') ? 'en' : 'pl';
    setLanguage(newLang);
});


// === LOGIKA POZOSTAŁYCH FUNKCJI ===

// --- Filtrowanie ---
const filterCheckboxes = document.querySelectorAll('.filter-check');

function updateFilters() {
    const filter5star = document.getElementById('filter-5star').checked;

    allMarkers.forEach(marker => {
        const data = marker.toaletaData;
        let show = true;

        if (filter5star && data.ocena < 5) {
            show = false;
        }

        if (show) marker.addTo(map);
        else marker.removeFrom(map);
    });
}

filterCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateFilters));

// --- Znajdź najbliższą ---
document.getElementById('find-nearest').addEventListener('click', () => {
    if (!userCurrentLocation) {
        const msg = currentLang === 'pl' 
            ? "Nie można znaleźć Twojej lokalizacji. Upewnij się, że zezwoliłeś na dostęp."
            : "Cannot find your location. Please ensure you allowed access.";
        alert(msg);
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
        map.setView(closestMarker.getLatLng(), 18);
        closestMarker.openPopup();
    } else {
        const msg = currentLang === 'pl' 
            ? "Brak pasujących toalet na mapie."
            : "No matching toilets on the map.";
        alert(msg);
    }
});


// === LOKALIZACJA UŻYTKOWNIKA ===
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
            .bindPopup("Jesteś tutaj / You are here").openPopup();
        userAccuracyCircle = L.circle(e.latlng, radius, accuracyCircleStyle).addTo(map);
        map.setView(e.latlng, 17); 
    } else {
        userLocationMarker.setLatLng(e.latlng);
        userAccuracyCircle.setLatLng(e.latlng).setRadius(radius);
    }
}

function onLocationError(e) {
    console.log("Location access denied or error.");
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Uruchomienie
map.locate({ watch: true, setView: false, maxZoom: 17 });

// Pierwsze renderowanie (po załadowaniu strony)
renderMarkers();
