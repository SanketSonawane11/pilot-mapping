"use client";

import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import SearchPilots from "./Search-pilots";

interface Pilot {
  _id: string;
  name: string;
  workEx: number;
  location: string;
  profileImage: string;
  coordinates: [number, number];
}

const MapComponent: React.FC = () => {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
  // console.log(mapboxToken);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [adminLocation, setAdminLocation] = useState<[number, number] | null>(
    null
  );
  const fallbackLocation: [number, number] = [72.86333, 19.090653];

  useEffect(() => {
    // Fetching All Pilots data
    const getAllPilots = async () => {
      try {
        const response = await axios.get<Pilot[]>(
          "https://pilot-mapping.onrender.com/api/v1/get-pilots"
        );
        // console.log(response.data);
        setPilots(response.data);
      } catch (err) {
        console.error("Error fetching pilots:", err);
      }
    };

    getAllPilots();

    // Get user's location
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setAdminLocation(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          setAdminLocation(fallbackLocation);
        }
      );
    }
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = mapboxToken || "";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: adminLocation || fallbackLocation,
      zoom: 9,
    });

    map.on("load", () => {
      // User location
      const adminPopupContent = document.createElement("div");
      adminPopupContent.className = "popup-content p-2";

      // User
      const adminTitle = document.createElement("h3");
      adminTitle.textContent = "Your Location";
      adminTitle.className = "font-bold text-lg mb-1 text-blue-900";
      adminPopupContent.appendChild(adminTitle);

      new mapboxgl.Marker({
        color: "#FF0000",
      })
        .setLngLat(adminLocation || fallbackLocation)
        .setPopup(new mapboxgl.Popup().setDOMContent(adminPopupContent))
        .addTo(map);

      // Pilot Markers
      pilots.forEach((pilot) => {
        const ele = document.createElement("div");
        ele.className = "marker bg-blue-400 w-3 h-3 rounded-full";

        const popupContent = document.createElement("div");
        popupContent.className = "popup-content p-2 bg-blue-200 rounded-lg";

        // ProfileImage
        const image = document.createElement("img");
        image.src = pilot.profileImage;
        image.alt = `${pilot.name}'s profile picture`;
        image.className = "w-16 h-16 rounded-full mb-2";

        // Name
        const name = document.createElement("h3");
        name.textContent = pilot.name;
        name.className = "font-bold text-lg text-black mb-1";

        // Location
        const location = document.createElement("p");
        location.textContent = `Location: ${pilot.location}`;
        location.className = "text-sm mb-1 text-[#272727]";

        // WorkEx
        const experience = document.createElement("p");
        experience.textContent = `Experience: ${pilot.workEx} years`;
        experience.className = "text-sm text-[#1a1a1a]";

        popupContent.appendChild(image);
        popupContent.appendChild(name);
        popupContent.appendChild(location);
        popupContent.appendChild(experience);

        new mapboxgl.Marker(ele)
          .setLngLat(pilot.coordinates)
          .setPopup(new mapboxgl.Popup().setDOMContent(popupContent))
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [adminLocation, pilots]);

  return (
    <div>
      <div id="map" className="h-screen w-full" />
      <SearchPilots setPilots={setPilots} />
    </div>
  );
};

export default MapComponent;
