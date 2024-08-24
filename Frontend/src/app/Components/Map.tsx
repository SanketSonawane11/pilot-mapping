"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import { LatLngExpression } from "leaflet";

interface Pilot {
  _id: string;
  name: string;
  experience: number;
  location: string;
  profileImage: string;
  geoCoordinates: [number, number];
}

const Map: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [adminLocation, setAdminLocation] = useState<LatLngExpression | null>(
    null
  );

  useEffect(() => {
    // Fetching all pilots data
    const getAllPilots = async () => {
      try {
        const response = await axios.get<Pilot[]>(
          "https://pilot-mapping.onrender.com/api/v1/get-pilots"
        );
        // Ensure data is an array
        const arrayData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        console.log("Converted array data: ", arrayData);
        setPilots(arrayData);
        console.log("Final polit data: ", pilots);
      } catch (err) {
        console.error(err);
      }
    };

    getAllPilots();

    // Getting Current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAdminLocation([position.coords.latitude, position.coords.longitude]);
        console.log("Admin location: ", adminLocation);
      },
      (error) => {
        console.error("Error getting location:", error);
        setAdminLocation([51.505, -0.09]);
        console.log("Fallback Admin Location: ", adminLocation);
      }
    );
  }, []);

  // Default center if adminLocation is not set
  const mapCenter: LatLngExpression = adminLocation || [51.505, -0.09];

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {adminLocation && (
        <Marker position={adminLocation}>
          <Tooltip>Admin's Location</Tooltip>
        </Marker>
      )}
      {pilots.map((pilot, id) => (
        <Marker key={id} position={pilot.geoCoordinates}>
          <Tooltip>{pilot.name}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
