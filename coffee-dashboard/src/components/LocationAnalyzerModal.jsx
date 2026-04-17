import React, { useEffect, useRef, useState } from "react";
import { analyzeLocation } from "../services/api";

const LocationAnalyzerModal = ({
  isOpen,
  onClose,
  onAnalysisComplete,
  lang = "th",
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [selectedCoords, setSelectedCoords] = useState({
    lat: 13.7367,
    lng: 100.5604,
  });
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/location/search?q=${encodeURIComponent(query)}`,
        );
        if (!res.ok) throw new Error("Search failed");
        const resData = await res.json();
        const data = resData.data;
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 500);
  };

  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSelectedCoords({ lat, lng });
    setSearchResults([]);
    setSearchQuery(result.display_name);

    // Auto-fill the location name based on search selection
    const placeName = result.name || result.display_name.split(",")[0];
    setLocationName(placeName);

    if (mapInstance.current) {
      mapInstance.current.flyTo([lat, lng], 16);
      if (markerInstance.current) {
        markerInstance.current.setLatLng([lat, lng]);
        replayDropAnimation();
      }
    }
  };

  const t = {
    th: {
      title: "วิเคราะห์พิกัดใหม่",
      subtitle: "เลือกพื้นที่บนแผนที่เพื่อดึงข้อมูลคู่แข่งรอบข้างด้วย AI",
      select: "จิ้มเลือกพิกัดบนแผนที่",
      name: "ชื่อเรียกพื้นที่ (เช่น สาขาพระราม 9)",
      analyze: "เริ่มการวิเคราะห์เชิงลึก",
      analyzing: "AI กำลังสแกนพื้นที่...",
      placeholder: "กรอกชื่อสาขาที่ต้องการวิเคราะห์",
      cancel: "ยกเลิก",
    },
    en: {
      title: "Strategic Site Profiler",
      subtitle:
        "Pinpoint a location to extract AI-driven competitor intelligence",
      select: "Select ppoint on map",
      name: "Branch Name (e.g., Rama 9 Outlet)",
      analyze: "Launch Site Analysis",
      analyzing: "Neural Scan in progress...",
      placeholder: "Enter location nickname",
      cancel: "Cancel",
    },
  }[lang];

  // Lift reverseGeocodeLocation to component scope
  const reverseGeocodeLocation = async (lat, lng) => {
    try {
      setLocationName(
        lang === "th" ? "กำลังค้นหาชื่อสถานที่..." : "Locating place...",
      );
      const res = await fetch(
        `http://localhost:3000/api/v1/location/reverse?lat=${lat}&lng=${lng}&lang=${lang}`,
      );
      if (!res.ok) throw new Error("Reverse geocode failed");
      const resData = await res.json();
      const data = resData.data;

      let placeName =
        data.name ||
        data.address?.amenity ||
        data.address?.shop ||
        data.address?.building;
      if (!placeName && data.address) {
        placeName =
          data.address.road ||
          data.address.suburb ||
          data.address.city ||
          "Unknown";
      }

      if (placeName) {
        setLocationName(placeName);
        setSearchQuery(data.display_name || placeName);
        // Bind popup to marker with location name
        if (markerInstance.current) {
          markerInstance.current
            .bindPopup(
              `<div style="font-family:Outfit,sans-serif; font-size:13px; font-weight:700; color:#fef5f0; white-space:nowrap; max-width:220px; overflow:hidden; text-overflow:ellipsis;">
                ${placeName}
              </div>`,
              {
                offset: [0, -50],
                closeButton: false,
                className: "coffee-popup",
                autoClose: false,
                closeOnClick: false,
              },
            )
            .openPopup();
        }
      } else {
        setLocationName("");
      }
    } catch (err) {
      console.error(err);
      setLocationName("");
    }
  };

  // Helper to replay drop animation on marker moves
  const replayDropAnimation = () => {
    if (!markerInstance.current) return;
    const el = markerInstance.current.getElement();
    if (!el) return;
    const inner = el.querySelector(".coffee-marker-drop");
    if (!inner) return;
    inner.classList.remove("coffee-marker-drop");
    void inner.offsetWidth; // force reflow to restart animation
    inner.classList.add("coffee-marker-drop");
  };

  // GPS "My Location" handler
  const handleGpsLocate = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelectedCoords({ lat, lng });
        setGpsLoading(false);
        if (mapInstance.current) {
          mapInstance.current.flyTo([lat, lng], 16);
          if (markerInstance.current) {
            markerInstance.current.setLatLng([lat, lng]);
            replayDropAnimation();
          }
        }
        reverseGeocodeLocation(lat, lng);
      },
      (err) => {
        console.error("Geolocation error", err);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    if (isOpen && !mapInstance.current) {
      setTimeout(() => {
        const L = window.L;
        if (!L) return;

        mapInstance.current = L.map(mapRef.current, {
          center: [selectedCoords.lat, selectedCoords.lng],
          zoom: 13,
          zoomControl: false,
          attributionControl: true,
        });

        L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);
        L.control.attribution({ position: "bottomright", prefix: false }).addTo(
          mapInstance.current,
        );

        // Use Carto Positron tiles (light, clean look like Google Maps)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 20,
          },
        ).addTo(mapInstance.current);

        // Create custom teardrop pin icon
        const coffeeIcon = L.divIcon({
          html: `<div class="coffee-marker-drop" style="position:relative; width:40px; height:52px;">
            <div class="coffee-pin-pulse" style="position:absolute; top:38px; left:50%; width:16px; height:16px; border-radius:50%; background:rgba(232,144,90,0.5); pointer-events:none;"></div>
            <div class="coffee-pin-pulse-delay" style="position:absolute; top:38px; left:50%; width:16px; height:16px; border-radius:50%; background:rgba(232,144,90,0.35); pointer-events:none;"></div>
            <svg viewBox="0 0 40 52" width="40" height="52" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35)); display:block;">
              <path d="M20 1 C9.5 1 1 9.5 1 20 C1 33 20 51 20 51 C20 51 39 33 39 20 C39 9.5 30.5 1 20 1 Z" fill="#e8905a" stroke="#dc743a" stroke-width="1.5"/>
              <circle cx="20" cy="20" r="7" fill="white" opacity="0.9"/>
              <circle cx="20" cy="20" r="4" fill="#e8905a"/>
            </svg>
          </div>`,
          className: "",
          iconSize: [40, 52],
          iconAnchor: [20, 51],
          popupAnchor: [0, -52],
        });

        markerInstance.current = L.marker(
          [selectedCoords.lat, selectedCoords.lng],
          {
            draggable: true,
            icon: coffeeIcon,
          },
        ).addTo(mapInstance.current);

        markerInstance.current.on("dragend", (e) => {
          const newCoords = e.target.getLatLng();
          setSelectedCoords(newCoords);
          replayDropAnimation();
          reverseGeocodeLocation(newCoords.lat, newCoords.lng);
        });

        mapInstance.current.on("click", (e) => {
          const { lat, lng } = e.latlng;
          setSelectedCoords({ lat, lng });
          markerInstance.current.setLatLng([lat, lng]);
          replayDropAnimation();
          reverseGeocodeLocation(lat, lng);
        });
      }, 100);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleAnalyze = async () => {
    if (!locationName)
      return alert(
        lang === "th" ? "กรุณาใส่ชื่อพื้นที่" : "Please enter a name",
      );
    setLoading(true);
    try {
      const res = await analyzeLocation(
        selectedCoords.lat,
        selectedCoords.lng,
        locationName,
      );
      if (res.success) {
        onAnalysisComplete(res.data);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes markerDrop {
          0%   { transform: translateY(-40px) scale(0.6); opacity: 0; }
          60%  { transform: translateY(4px) scale(1.08); opacity: 1; }
          80%  { transform: translateY(-3px) scale(0.97); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .coffee-marker-drop {
          animation: markerDrop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes pinPulse {
          0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 0.9; }
          70%  { transform: translate(-50%, -50%) scale(2.8); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(2.8); opacity: 0; }
        }
        .coffee-pin-pulse {
          animation: pinPulse 1.8s ease-out infinite;
        }
        .coffee-pin-pulse-delay {
          animation: pinPulse 1.8s ease-out 0.6s infinite;
        }

        .leaflet-container.coffee-map-cursor {
          cursor: crosshair !important;
        }
        .leaflet-container.coffee-map-cursor .leaflet-interactive {
          cursor: grab !important;
        }

        .coffee-map-no-invert .leaflet-tile {
          filter: none !important;
        }

        .coffee-popup .leaflet-popup-content-wrapper {
          background: rgba(61, 40, 23, 0.92) !important;
          border: 1.5px solid #e8905a !important;
          border-radius: 10px !important;
          padding: 0 !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25) !important;
          backdrop-filter: blur(8px);
        }
        .coffee-popup .leaflet-popup-content {
          margin: 8px 14px !important;
        }
        .coffee-popup .leaflet-popup-tip-container {
          display: none !important;
        }
      ` }} />
      <div
        className="absolute inset-0 bg-espresso-900/60 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative bg-gradient-to-br from-cream-100 to-latte-50 w-full max-w-5xl rounded-[2.5rem] shadow-2xl border-2 border-caramel-300 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col lg:flex-row h-[80vh] lg:h-[650px]">
          {/* Map Section */}
          <div className="flex-1 relative bg-gradient-to-br from-cream-50 to-latte-100 border-r-2 border-caramel-200">
            {/* Search Bar Overlay */}
            <div className="absolute top-6 left-6 right-6 z-[1000] flex flex-col gap-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-60 group-focus-within:opacity-100 transition-opacity">
                  <span>🔍</span>
                </div>
                <input
                  type="text"
                  placeholder={
                    lang === "th"
                      ? "ค้นหาสถานที่ (เช่น สยามพารากอน)..."
                      : "Search location (e.g., Siam Paragon)..."
                  }
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-white/90 backdrop-blur-xl border-2 border-caramel-300 rounded-2xl py-3 pl-12 pr-10 text-sm text-espresso-900 placeholder:text-espresso-500 focus:outline-none focus:ring-2 focus:ring-caramel-500/50 focus:border-caramel-500 shadow-lg transition-all"
                />
                {searchQuery.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="absolute inset-y-0 right-3 flex items-center text-espresso-400 hover:text-espresso-700 transition-colors"
                    type="button"
                    title={lang === "th" ? "ลบ" : "Clear"}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l8 8M14 6l-8 8" />
                    </svg>
                  </button>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="bg-white/95 backdrop-blur-xl border-2 border-caramel-300 rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-top-2">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => selectSearchResult(res)}
                      className="w-full text-left px-5 py-3 text-xs text-espresso-900 hover:bg-caramel-300 hover:text-cream-50 border-b border-caramel-200 last:border-0 transition-colors flex flex-col gap-1 font-medium"
                    >
                      <span className="font-bold truncate">
                        {res.display_name.split(",")[0]}
                      </span>
                      <span className="opacity-70 text-[10px] truncate">
                        {res.display_name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              ref={mapRef}
              className="w-full h-full z-10 coffee-map-cursor coffee-map-no-invert"
            ></div>

            {/* GPS "My Location" Button */}
            <button
              onClick={handleGpsLocate}
              disabled={gpsLoading}
              title={lang === "th" ? "ตำแหน่งของฉัน" : "My Location"}
              className="absolute bottom-6 right-14 z-[1000] w-10 h-10 rounded-xl bg-white border-2 border-caramel-300 shadow-lg flex items-center justify-center hover:bg-caramel-50 active:scale-95 transition-all disabled:opacity-60"
            >
              {gpsLoading ? (
                <div className="w-4 h-4 border-2 border-caramel-500/30 border-t-caramel-500 rounded-full animate-spin"></div>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#e8905a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  <circle cx="12" cy="12" r="7" fill="none" opacity="0.3" />
                </svg>
              )}
            </button>
            <div className="absolute bottom-6 left-6 z-20 bg-gradient-to-r from-espresso-600 to-espresso-700 backdrop-blur-md px-4 py-3 rounded-xl border-2 border-caramel-400 pointer-events-none shadow-lg">
              <span className="text-[10px] font-black text-cream-100 uppercase tracking-widest block">
                📍 Location
              </span>
              <span className="text-cream-50 font-mono text-xs mt-1">
                {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
              </span>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-96 p-8 flex flex-col justify-between bg-gradient-to-br from-espresso-700 to-espresso-800">
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-cream-50 tracking-tight leading-tight mb-2">
                  {t.title}
                </h2>
                <p className="text-xs text-cream-200 font-medium leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              <div className="space-y-6">
                {/* Instructions */}
                <div className="p-4 bg-caramel-500/20 border-2 border-caramel-400 rounded-xl">
                  <p className="text-xs text-cream-100 leading-relaxed">
                    📍 {lang === "th" ? "คลิกบนแผนที่เพื่อเลือกตำแหน่ง หรือค้นหาด้วยชื่อสถานที่" : "Click on the map to select a location, or search by name"}
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-black text-cream-200 uppercase tracking-widest block mb-3 px-1">
                    ☕ {t.name}
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full bg-cream-100 border-2 border-caramel-300 rounded-xl px-4 py-3 text-sm text-espresso-900 placeholder:text-espresso-500 focus:outline-none focus:ring-2 focus:ring-caramel-500/50 focus:border-caramel-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full py-4 rounded-xl text-sm font-black transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-caramel-300/50 text-cream-100 cursor-not-allowed"
                    : "bg-gradient-to-r from-caramel-500 to-caramel-600 text-cream-50 hover:from-caramel-600 hover:to-caramel-700"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream-100/30 border-t-cream-100 rounded-full animate-spin"></div>
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <span>📡</span> {t.analyze}
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 text-xs font-bold text-cream-200 hover:text-cream-50 transition-all"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationAnalyzerModal;
