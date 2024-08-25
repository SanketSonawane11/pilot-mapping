"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Pilot {
  _id: string;
  name: string;
  workEx: number;
  location: string;
  profileImage: string;
  coordinates: [number, number];
}

interface SearchPilotProps {
  setPilots: (pilots: Pilot[]) => void;
}

export default function SearchPilots({ setPilots }: SearchPilotProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  // const [matchedPilots, setMatchedPilots] = useState<Pilot[]>([]);
  const [longitude, setLongitude] = useState<number | undefined>();
  const [latitude, setLatitude] = useState<number | undefined>();
  const [experience, setExperience] = useState<number | undefined>();
  const [range, setRange] = useState<number | undefined>();
  const [submitButtonText, setSubmitButtonText] = useState(
    "Get Current Location"
  );

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    if (latitude === undefined && longitude === undefined) {
      setSubmitButtonText("Get Current Location");
    } else {
      setSubmitButtonText("Submit");
    }
  }, [longitude, latitude]);

  const searchPilots = async () => {
    try {
      if (latitude !== undefined && longitude !== undefined) {
        // console.log(longitude, latitude, range, experience);
        const response = await axios.post(
          "https://pilot-mapping.onrender.com/api/v1/get-matches",
          {
            longitude,
            latitude,
            experience,
            range,
          }
        );
        setLatitude(undefined);
        setLongitude(undefined);
        setExperience(undefined);
        setRange(undefined);
        setIsFormVisible(false);
        console.log(response.data);
        setPilots(response.data);
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLongitude(position.coords.longitude);
            setLatitude(position.coords.latitude);
            setSubmitButtonText("Submit");
            searchPilots();
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    } catch (err) {
      console.log("Error fetching: ", err);
    }
  };

  return (
    <div className="fixed top-5 left-5 z-20">
      <button
        onClick={toggleFormVisibility}
        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg hover:from-blue-600 hover:to-blue-500 transition duration-200 shadow-lg"
      >
        {isFormVisible ? "Close" : "Search for Pilots"}
      </button>

      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70"
          >
            <div className="bg-white p-8 rounded-3xl shadow-xl relative w-full max-w-md">
              <form className="text-gray-900">
                <h2 className="text-2xl w-full text-center mb-6 font-bold text-blue-600 tracking-wide">
                  Search for Pilots
                </h2>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="latitude"
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    value={latitude || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setLatitude(parseFloat(e.target.value) || undefined)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="longitude"
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    value={longitude || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setLongitude(parseFloat(e.target.value) || undefined)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="experience"
                  >
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    id="experience"
                    value={experience || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setExperience(parseFloat(e.target.value) || undefined)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="range"
                  >
                    Range (km)
                  </label>
                  <input
                    type="number"
                    id="range"
                    value={range || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setRange(parseFloat(e.target.value) || undefined)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={searchPilots}
                    className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-300 shadow-lg"
                  >
                    {submitButtonText}
                  </button>
                  <button
                    type="button"
                    onClick={toggleFormVisibility}
                    className="px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-lg hover:from-gray-700 hover:to-gray-600 transition duration-300 shadow-lg"
                  >
                    Go back to Map
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
