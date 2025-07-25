import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaBus } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapUpdater from "./MapUpdater";

const LeafletMap = ({ selectedRoute, searchQuery }) => {
  const buses = [
    { id: 1, route: "Route A", busName: "Surjomukhi", busNumber: "12", position: [23.874, 90.320], status: "On Time" },
    { id: 2, route: "Route A", busName: "Surjomukhi", busNumber: "19", position: [23.878, 90.325], status: "On Time" },
    { id: 3, route: "Route B", busName: "D Link", busNumber: "B-201", position: [23.749893, 90.379015], status: "5 min late" },
    { id: 4, route: "Route C", busName: "Rojonigondha", busNumber: "C-301", position: [23.870, 90.315], status: "Delayed" },
  ];

  // Filter by route + search
  const filteredBuses = useMemo(() => {
    let result = selectedRoute === "All" ? buses : buses.filter(b => b.route === selectedRoute);
    if (searchQuery) {
      result = result.filter(b =>
        b.busName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.busNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [selectedRoute, searchQuery]);

  // center map to first bus
  const mapCenter = filteredBuses.length > 0 ? filteredBuses[0].position : [23.874, 90.320];

  const iconMarkup = renderToStaticMarkup(<FaBus size={28} color="#16a34a" />);
  const busIcon = L.divIcon({ html: iconMarkup, className: "", iconSize: [28, 28], iconAnchor: [14, 14] });

  return (
    <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
      <MapContainer center={mapCenter} zoom={14} style={{ width: "100%", height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater center={mapCenter} />

        {filteredBuses.map((bus) => (
          <Marker key={bus.id} position={bus.position} icon={busIcon}>
            <Popup>
              <strong>{bus.busName}</strong> ({bus.busNumber}) <br />
              Route: {bus.route} <br />
              Status: {bus.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
