import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const position = [23.874, 90.320]; // DIU location 

const LeafletMap = () => {
  return (
    <div className="w-[1000px] h-[500px] mx-auto">
      <MapContainer center={position} zoom={14} style={{ height: "100%", width: "100%" }}>
        {/* Base Map Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Marker */}
        <Marker position={position}>
          <Popup>
            DIU Main Campus <br /> Current Bus Location.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
