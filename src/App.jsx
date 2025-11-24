// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Fix default Leaflet marker icons in bundlers (Vite/CRA)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ---- Static data ported from your SQLite seed (Python) ----
// Types: "pharmacy", "walkin_clinic", "student_health"
const initialLocations = [
  // PHARMACIES
  {
    id: 1,
    name: "Irwin's Pharmacy",
    type: "pharmacy",
    address: "77 Shandon Street, Cork",
    phone: "021 430 4165",
    eircode: "T23 RR4K",
    lat: 51.90407,
    lng: -8.47875
  },
  {
    id: 2,
    name: "Irwin's Pharmacy - Togher",
    type: "pharmacy",
    address: "The Village, Togher Road, Cork",
    phone: "021 496 2777",
    eircode: "T12 X0PP",
    lat: 51.87342,
    lng: -8.50142
  },
  {
    id: 3,
    name: "Deasy's Life Pharmacy",
    type: "pharmacy",
    address: "99 Shandon Street, Cork",
    phone: "021 430 4535",
    eircode: "T23 D3CN",
    lat: 51.90269,
    lng: -8.48047
  },
  {
    id: 4,
    name: "DMC Life Pharmacy",
    type: "pharmacy",
    address: "91 Patrick Street, Cork",
    phone: "021 427 3774",
    eircode: "T12 K5FK",
    lat: 51.89854,
    lng: -8.47480
  },
  {
    id: 5,
    name: "Phelan's Late Night Pharmacy",
    type: "pharmacy",
    address: "9 Patrick Street, Cork City",
    phone: "021 427 2511",
    eircode: "T12 F72H",
    lat: 51.89885,
    lng: -8.47402
  },
  {
    id: 6,
    name: "College Road CarePlus Pharmacy",
    type: "pharmacy",
    address: "63 College Rd, Cork",
    phone: "021 434 0455",
    eircode: "T12 X5F3",
    lat: 51.88467,
    lng: -8.49787
  },
  {
    id: 7,
    name: "Johnson's Pharmacy",
    type: "pharmacy",
    address: "Victoria Cross Road, Cork",
    phone: "021 454 1004",
    eircode: "T12 YK60",
    lat: 51.88982,
    lng: -8.50932
  },
  {
    id: 8,
    name: "Brendan Lynch Pharmacy",
    type: "pharmacy",
    address: "17 Bridge St, Victorian Quarter, Cork",
    phone: "021 450 1438",
    eircode: "T23 K6HT",
    lat: 51.90145,
    lng: -8.47280
  },
  {
    id: 9,
    name: "St. Luke's Pharmacy",
    type: "pharmacy",
    address: "38 Wellington Rd, St Luke's, Cork",
    phone: "021 451 8272",
    eircode: "T23 AFR3",
    lat: 51.90416,
    lng: -8.46184
  },
  {
    id: 10,
    name: "Murphy's Pharmacy",
    type: "pharmacy",
    address: "48 N Main St, Centre, Cork",
    phone: "021 427 4121",
    eircode: "T12 R286",
    lat: 51.89757,
    lng: -8.47576
  },
  {
    id: 11,
    name: "Walsh's Pharmacy",
    type: "pharmacy",
    address: "123 Shandon Street, Cork, Co. Cork",
    phone: "021 439 7767",
    eircode: "T23 CK11",
    lat: 51.90554,
    lng: -8.48081
  },
  {
    id: 12,
    name: "Marian Pharmacy",
    type: "pharmacy",
    address: "44a Lower Friars Walk, Ballyphehane, Cork",
    phone: "021 601 9533",
    eircode: "T12 YR26",
    lat: 51.88595,
    lng: -8.47505
  },
  // CLINICS
  {
    id: 13,
    name: "UCC Student Health Centre",
    type: "student_health",
    address: "Crow's Nest, Victoria Cross Rd, Cork",
    phone: "021 490 2311",
    eircode: "T12 HXW4",
    lat: 51.88915,
    lng: -8.50497
  },
  {
    id: 14,
    name: "Doctor365 – The Lough Walk-In Clinic",
    type: "walkin_clinic",
    address: "25 Earlwood Estate, Togher, Cork",
    phone: "0818 000 365",
    eircode: "T12 PP92",
    lat: 51.87648,
    lng: -8.49643
  },
  {
    id: 15,
    name: "Doctor365 – Douglas Walk-In Clinic",
    type: "walkin_clinic",
    address: "St Patricks Woollen Mills, Douglas, Cork",
    phone: "0818 000 365",
    eircode: "T12 PTW9",
    lat: 51.88004,
    lng: -8.44864
  },
];

// Utility for distance between two lat/lng points (Haversine)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371e3; // metres

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}

// Helper component to imperatively recenter map when a location is selected
function RecenterOnLocation({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target && target.lat && target.lng) {
      map.setView([target.lat, target.lng], 16);
    }
  }, [target, map]);
  return null;
}

const CORK_CITY_CENTER = {
  lat: 51.8979,
  lng: -8.4706,
};

export default function App() {
  const [locations, setLocations] = useState(initialLocations);
  const [filterType, setFilterType] = useState("all"); // all | pharmacy | walkin_clinic | student_health
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestLocationId, setNearestLocationId] = useState(null);
  const [geoError, setGeoError] = useState("");
  const [showTips, setShowTips] = useState(true);

  // On mount: try to get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoError("");
      },
      () => {
        setGeoError("Could not get your location. You can still browse locations.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // For production use, consider your own geocoding service.

  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === selectedLocationId) || null,
    [locations, selectedLocationId]
  );

  const nearestLocation = useMemo(
    () => locations.find((loc) => loc.id === nearestLocationId) || null,
    [locations, nearestLocationId]
  );

  // Filter & search
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (filterType !== "all" && loc.type !== filterType) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q) ||
        (loc.eircode && loc.eircode.toLowerCase().includes(q))
      );
    });
  }, [locations, filterType, searchQuery]);

  const handleQuickFilter = (type) => {
    setFilterType(type);
    setSelectedLocationId(null);
    setNearestLocationId(null);
  };

  const handleFindNearest = () => {
    if (!userLocation) {
      setGeoError("We don't have your location. Please allow location access in your browser.");
      return;
    }

    const candidates = filteredLocations.filter(
      (loc) => loc.lat && loc.lng
    );

    if (!candidates.length) {
      setGeoError("No locations with coordinates available yet.");
      return;
    }

    let best = null;
    let bestDist = Infinity;
    for (const loc of candidates) {
      const d = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        loc.lat,
        loc.lng
      );
      if (d < bestDist) {
        bestDist = d;
        best = loc;
      }
    }
    if (best) {
      setNearestLocationId(best.id);
      setSelectedLocationId(best.id);
      setGeoError("");
    }
  };

  const buildMapsUrl = (loc) => {
    const query = `${loc.address}, ${loc.eircode}, Cork, Ireland`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
  };

  const cleanPhone = (phone) => phone.replace(/\s+/g, "");

  const getTypeLabel = (type) => {
    if (type === "pharmacy") return "💊 Pharmacy";
    if (type === "walkin_clinic") return "🏥 Walk-In Clinic";
    if (type === "student_health") return "🎓 UCC Student Health Centre";
    return "📍 Location";
  };

  const getTypeBadgeClass = (type) => {
    if (type === "pharmacy") return "badge badge-pharmacy";
    if (type === "walkin_clinic") return "badge badge-walkin";
    if (type === "student_health") return "badge badge-student";
    return "badge";
  };

  const educationalTextForType = (type) => {
    if (type === "student_health") {
      return "🎓 UCC Students: FREE GP visits and prescriptions available here (for registered students). Ideal for routine healthcare and prescriptions.";
    }
    if (type === "walkin_clinic") {
      return "🏥 Walk-in clinics offer same-day GP-style appointments without booking. Great for urgent, non-emergency medical issues and prescriptions.";
    }
    if (type === "pharmacy") {
      return "💊 Pharmacies dispense prescriptions, provide over-the-counter medicines, and offer basic health advice such as minor ailments and medication queries.";
    }
    return "";
  };

  const mapCenter = selectedLocation?.lat
    ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
    : CORK_CITY_CENTER;

  return (
    <div className="app-root">
      {/* Top hero section (mirrors Kivy welcome screen) */}
      <header className="hero">
        <div className="hero-text">
          <h1>Cork Pharmacy &amp; Clinic Finder</h1>
          <p className="hero-subtitle">
            Helping new &amp; international students quickly find pharmacies,
            walk-in clinics, and the UCC Student Health Centre in Cork City.
          </p>
          <ul className="hero-list">
            <li>💊 Nearest pharmacies for prescriptions</li>
            <li>🏥 Doctor365 walk-in clinics for same-day GP prescriptions</li>
            <li>🎓 UCC Student Health Centre (free GP support for UCC students)</li>
          </ul>

          <div className="hero-actions">
            <button
              className="btn primary"
              onClick={() => handleQuickFilter("all")}
            >
              📋 View All Locations
            </button>
            <button
              className="btn secondary"
              onClick={() => handleQuickFilter("pharmacy")}
            >
              💊 Find Pharmacies
            </button>
            <button
              className="btn secondary"
              onClick={() => handleQuickFilter("walkin_clinic")}
            >
              🏥 Find Walk-In Clinics
            </button>
          </div>
        </div>
      </header>

      {/* Main layout: map + sidebar */}
      <main className="main-layout">
        {/* LEFT: Map */}
        <section className="map-section">
          <div className="map-toolbar">
            <span className="map-toolbar-title">Map View</span>
            <div className="map-toolbar-actions">
              <button className="btn small" onClick={handleFindNearest}>
                📍 Find Nearest in View
              </button>
              {nearestLocation && (
                <span className="nearest-label">
                  Nearest: <strong>{nearestLocation.name}</strong>
                </span>
              )}
            </div>
          </div>

          {geoError && <p className="alert">{geoError}</p>}

          <div className="map-container">
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* user location marker */}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>You are here</Popup>
                </Marker>
              )}

              {/* location markers */}
              {filteredLocations
                .filter((loc) => loc.lat && loc.lng)
                .map((loc) => (
                  <Marker
                    key={loc.id}
                    position={[loc.lat, loc.lng]}
                    eventHandlers={{
                      click: () => setSelectedLocationId(loc.id),
                    }}
                  >
                    <Popup>
                      <strong>{loc.name}</strong>
                      <br />
                      {getTypeLabel(loc.type)}
                      <br />
                      {loc.address}
                    </Popup>
                  </Marker>
                ))}

              {/* recenter when selected */}
              {selectedLocation && (
                <RecenterOnLocation target={selectedLocation} />
              )}
            </MapContainer>
          </div>
        </section>

        {/* RIGHT: Filters + list + details */}
        <section className="sidebar">
          {/* Filters and search */}
          <div className="filters-card">
            <div className="filters-row">
              <button
                className={`chip ${filterType === "all" ? "chip-active" : ""}`}
                onClick={() => setFilterType("all")}
              >
                All
              </button>
              <button
                className={`chip ${
                  filterType === "pharmacy" ? "chip-active" : ""
                }`}
                onClick={() => setFilterType("pharmacy")}
              >
                Pharmacies
              </button>
              <button
                className={`chip ${
                  filterType === "walkin_clinic" ? "chip-active" : ""
                }`}
                onClick={() => setFilterType("walkin_clinic")}
              >
                Walk-In Clinics
              </button>
              <button
                className={`chip ${
                  filterType === "student_health" ? "chip-active" : ""
                }`}
                onClick={() => setFilterType("student_health")}
              >
                UCC Health
              </button>
            </div>

            <input
              type="text"
              className="search-input"
              placeholder="Search by name, address, or Eircode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <p className="results-count">
              Showing <strong>{filteredLocations.length}</strong> locations
            </p>
          </div>

          {/* List of locations */}
          <div className="list-card">
            {filteredLocations.length === 0 && (
              <p className="empty-state">
                No locations found. Try clearing your search or changing filters.
              </p>
            )}

            <div className="list-scroll">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  className={`location-card ${
                    selectedLocationId === loc.id ? "location-card-active" : ""
                  }`}
                  onClick={() => setSelectedLocationId(loc.id)}
                >
                  <div className="location-card-header">
                    <span className={getTypeBadgeClass(loc.type)}>
                      {getTypeLabel(loc.type)}
                    </span>
                  </div>
                  <h3 className="location-name">{loc.name}</h3>
                  <p className="location-line">
                    📍 <span>{loc.address}</span>
                  </p>
                  <p className="location-line">
                    📮 <span>{loc.eircode}</span>
                  </p>
                  <p className="location-line">
                    📞 <span>{loc.phone}</span>
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Details for selected location */}
          {selectedLocation && (
            <div className="details-card">
              <h2 className="details-title">{selectedLocation.name}</h2>
              <p className="details-type">
                {getTypeLabel(selectedLocation.type)}
              </p>

              <div className="details-grid">
                <div>
                  <h4>Address</h4>
                  <p>{selectedLocation.address}</p>
                  <p>{selectedLocation.eircode}</p>
                </div>
                <div>
                  <h4>Contact</h4>
                  <p>{selectedLocation.phone}</p>
                </div>
              </div>

              <div className="details-actions">
                <a
                  className="btn primary full"
                  href={`tel:${cleanPhone(selectedLocation.phone)}`}
                >
                  📞 Call Now
                </a>
                <a
                  className="btn outline full"
                  href={buildMapsUrl(selectedLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🗺️ Open in Google Maps
                </a>
              </div>

              <p className="details-edu">
                {educationalTextForType(selectedLocation.type)}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Educational section */}
      <section className="educational-section">
        <button
          className="edu-toggle"
          onClick={() => setShowTips((v) => !v)}
        >
          {showTips ? "▼" : "▶"} Learn about pharmacies, walk-in clinics & UCC
          health
        </button>

        {showTips && (
          <div className="edu-content">
            <h2>Getting healthcare as a new student in Cork</h2>
            <div className="edu-grid">
              <div className="edu-card">
                <h3>💊 Pharmacies</h3>
                <p>
                  Pharmacies dispense prescription medicines, sell over-the-counter
                  products (like painkillers and cold/flu remedies), and offer
                  advice on minor illnesses, medications, and vaccinations.
                </p>
                <p>
                  You usually need a prescription from a GP or walk-in clinic for
                  many medicines, but some treatments are available without one.
                </p>
              </div>

              <div className="edu-card">
                <h3>🏥 Walk-In Clinics (Doctor365)</h3>
                <p>
                  Walk-in clinics like Doctor365 provide GP-style consultations
                  without a prior appointment. They are ideal for urgent, but
                  non-emergency issues: infections, minor injuries, and
                  prescription renewals.
                </p>
                <p>
                  You may pay a consultation fee, but you usually get a
                  prescription in the same visit.
                </p>
              </div>

              <div className="edu-card">
                <h3>🎓 UCC Student Health Centre</h3>
                <p>
                  If you are a registered UCC student, you can access the{" "}
                  <strong>UCC Student Health Centre</strong> for free GP
                  consultations and prescriptions (subject to UCC policies).
                </p>
                <p>
                  This is often the best first option for non-emergency health
                  issues, mental health concerns, and general medical advice.
                </p>
              </div>
            </div>

            <p className="edu-note">
              ⚠️ For life-threatening emergencies, always call emergency services
              (999 or 112) instead of visiting a pharmacy or walk-in clinic.
            </p>
          </div>
        )}
      </section>

      <footer className="footer">
        <p>
          Cork Pharmacy &amp; Clinic Finder — built for new &amp; international
          students in Cork City.
        </p>
      </footer>
    </div>
  );
}
