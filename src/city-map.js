import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CITY_MAP_ITEMS } from './city-map-items.js';

const viseuCenter = [40.6575, -7.913];
const mapElement = document.querySelector('#cityMap');
const locateButton = document.querySelector('#locateUser');
const locationStatus = document.querySelector('#cityMapLocationStatus');
const networkStatus = document.querySelector('#cityMapNetworkStatus');

let cityMap;
let marker;
let accuracyCircle;
let watchId = null;
let latestPosition = null;
let locationAllowed = false;
let approximateLocation = true;
let mapVisible = false;
let trackingRequested = false;
let itemMarkers = new Map();
let claimedItemIds = new Set();
let hasFittedItems = false;

function setLocationStatus(message) {
  locationStatus.textContent = message;
}

function stopWatching() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

function clearLocation() {
  trackingRequested = false;
  stopWatching();
  latestPosition = null;
  if (marker) {
    cityMap.removeLayer(marker);
    cityMap.removeLayer(accuracyCircle);
    marker = null;
    accuracyCircle = null;
  }
  locateButton.textContent = 'Locate me';
  locateButton.setAttribute('aria-pressed', 'false');
}

function displayPosition(position, centerMap) {
  const rawLat = position.coords.latitude;
  const rawLng = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  const lat = approximateLocation ? Math.round(rawLat / 0.003) * 0.003 : rawLat;
  const lngStep = 0.003 / Math.cos((rawLat * Math.PI) / 180);
  const lng = approximateLocation ? Math.round(rawLng / lngStep) * lngStep : rawLng;
  const point = [lat, lng];
  const radius = approximateLocation ? Math.max(accuracy, 250) : accuracy;

  if (!marker) {
    marker = L.circleMarker(point, {
      radius: 9,
      color: '#fff',
      weight: 3,
      fillColor: '#1d4ed8',
      fillOpacity: 1
    }).addTo(cityMap);
    accuracyCircle = L.circle(point, {
      radius,
      color: '#1d4ed8',
      weight: 1,
      fillColor: '#1d4ed8',
      fillOpacity: 0.12
    }).addTo(cityMap);
  } else {
    marker.setLatLng(point);
    accuracyCircle.setLatLng(point).setRadius(radius);
  }

  if (centerMap) cityMap.setView(point, approximateLocation ? 15 : 17);
  setLocationStatus(approximateLocation
    ? 'Approximate location shown on this device only.'
    : 'Your location is shown on this device only.');
}

function startWatching() {
  if (!mapVisible || !locationAllowed || !trackingRequested || watchId !== null) return;
  if (!window.isSecureContext || !navigator.geolocation) {
    setLocationStatus('Location needs a supported browser and a secure connection (HTTPS).');
    return;
  }

  locateButton.textContent = 'Locating…';
  setLocationStatus('Requesting location permission…');
  try {
    watchId = navigator.geolocation.watchPosition(
      function (position) {
        const shouldCenter = !latestPosition;
        latestPosition = position;
        displayPosition(position, shouldCenter);
        locateButton.textContent = 'Stop location';
      },
      function (error) {
        clearLocation();
        if (error.code === 1) {
          setLocationStatus('Location permission was denied. You can enable it in your browser settings.');
        } else if (error.code === 2) {
          setLocationStatus('Your location is unavailable right now. Try again when location services are ready.');
        } else {
          setLocationStatus('Location request timed out. Check your connection or try again.');
        }
      },
      { enableHighAccuracy: false, maximumAge: 10000, timeout: 20000 }
    );
  } catch (error) {
    clearLocation();
    console.error('Unable to request the device location.', error);
    setLocationStatus('The browser could not start location. Check browser permissions and try again.');
    return;
  }
  locateButton.setAttribute('aria-pressed', 'true');
}

function updateNetworkStatus() {
  networkStatus.textContent = navigator.onLine
    ? 'Online street map · © OpenStreetMap contributors'
    : 'Offline: street-map tiles may be unavailable. Close this view to use the illustrated game map.';
}

function itemIcon(claimed) {
  return L.divIcon({
    className: 'city-map-item-icon',
    html: '<span class="city-item-pin' + (claimed ? ' is-claimed' : '') + '" aria-hidden="true">' + (claimed ? '✓' : '✦') + '</span>',
    iconSize: [38, 42],
    iconAnchor: [19, 38],
    popupAnchor: [0, -36]
  });
}

function itemPopup(item) {
  const claimed = claimedItemIds.has(item.id);
  return '<section class="city-item-popup"><h3>' + item.name + '</h3><p>' + item.description + '</p>' +
    '<p class="city-item-reward">+ ' + item.v + ' Viseu coins · ' + item.xp + ' XP</p>' +
    '<button type="button" class="city-item-action" data-city-item-claim="' + item.id + '"' + (claimed ? ' disabled' : '') + '>' +
    (claimed ? 'Collected' : 'Collect discovery') + '</button>' +
    '<button type="button" class="city-item-explore" data-city-item-explore="' + item.spotId + '">Explore in game</button>' +
    '<small>Prototype discovery: this does not verify a physical visit or record your location.</small></section>';
}

export function showCityMap() {
  mapVisible = true;
  if (!cityMap) {
    cityMap = L.map(mapElement, { zoomControl: false }).setView(viseuCenter, 15);
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(cityMap);
    CITY_MAP_ITEMS.forEach(function (item) {
      const itemMarker = L.marker([item.lat, item.lng], {
        title: item.name,
        alt: item.name,
        icon: itemIcon(claimedItemIds.has(item.id))
      }).addTo(cityMap);
      itemMarker.bindPopup(itemPopup(item), { maxWidth: 280 });
      itemMarkers.set(item.id, itemMarker);
    });
    mapElement.addEventListener('click', function (event) {
      const claimButton = event.target.closest('[data-city-item-claim]');
      const exploreButton = event.target.closest('[data-city-item-explore]');
      if (claimButton) {
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent('viseu:city-item-claim', {
          detail: { id: claimButton.getAttribute('data-city-item-claim') }
        }));
      } else if (exploreButton) {
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent('viseu:city-item-explore', {
          detail: { spotId: exploreButton.getAttribute('data-city-item-explore') }
        }));
      }
    });
    tileLayer.on('tileload', updateNetworkStatus);
    tileLayer.on('tileerror', function () {
      networkStatus.textContent = navigator.onLine
        ? 'Street-map tiles could not load. Check your connection or close this view to use the game map.'
        : 'Offline: street-map tiles may be unavailable. Close this view to use the illustrated game map.';
    });
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    document.addEventListener('visibilitychange', function () {
      if (!mapVisible) return;
      if (document.hidden) stopWatching();
      else if (locationAllowed && trackingRequested) startWatching();
    });
  }
  mapElement.hidden = false;
  updateNetworkStatus();
  requestAnimationFrame(function () {
    cityMap.invalidateSize();
    if (!hasFittedItems) {
      cityMap.fitBounds(L.latLngBounds(CITY_MAP_ITEMS.map(function (item) {
        return [item.lat, item.lng];
      })), { paddingTopLeft: [28, 120], paddingBottomRight: [28, 130], maxZoom: 15 });
      hasFittedItems = true;
    }
    startWatching();
  });
}

export function setCityItemsClaimed(ids) {
  claimedItemIds = new Set(ids);
  CITY_MAP_ITEMS.forEach(function (item) {
    const itemMarker = itemMarkers.get(item.id);
    if (!itemMarker) return;
    itemMarker.setIcon(itemIcon(claimedItemIds.has(item.id)));
    itemMarker.setPopupContent(itemPopup(item));
  });
}

export function hideCityMap() {
  mapVisible = false;
  clearLocation();
  mapElement.hidden = true;
}

locateButton.addEventListener('click', function () {
  if (!locationAllowed) {
    setLocationStatus('First enable “Allow location on city map” in your Profile settings.');
    return;
  }
  if (watchId !== null || latestPosition) {
    clearLocation();
    setLocationStatus('Location sharing is off. Your position was removed from the map.');
    return;
  }
  trackingRequested = true;
  startWatching();
});

window.addEventListener('viseu:location-preference', function (event) {
  locationAllowed = Boolean(event.detail && event.detail.enabled);
  approximateLocation = !event.detail || event.detail.approximate !== false;
  if (!locationAllowed) {
    clearLocation();
    setLocationStatus('Location is off. Your position is not shown.');
  } else if (latestPosition) {
    displayPosition(latestPosition, false);
  }
});
