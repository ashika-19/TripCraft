import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import ExploreDestinations from "./pages/ExploreDestinations.jsx";
import MyTrips from "./pages/MyTrips.jsx";
import ItineraryBuilder from "./pages/ItineraryBuilder.jsx";
import BudgetPlanner from "./pages/BudgetPlanner.jsx";
import PackingChecklist from "./pages/PackingChecklist.jsx";

import useLocalStorage from "./hooks/useLocalStorage.js";
import destinations from "./data/destinations.js";
import { generateId } from "./utils/storage.js";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  const [trips, setTrips] = useLocalStorage("tripcraft_trips", []);

  const addTrip = (form) => {
    const dest =
      destinations.find((d) => d.id === form.destinationId) || destinations[0];
    const trip = {
      id: generateId(),
      name: form.name.trim() || `Trip to ${dest.name}`,
      destinationId: dest.id,
      destination: dest.name,
      country: dest.country,
      image: dest.image,
      startDate: form.startDate,
      endDate: form.endDate,
      budget: Number(form.budget) || 0,
      travellers: Number(form.travellers) || 1,
      itinerary: {},
      expenses: [],
      packing: [],
      createdAt: Date.now(),
    };
    setTrips((prev) => [trip, ...prev]);
    return trip;
  };

  const updateTrip = (id, changes) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    );
  };

  const deleteTrip = (id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar tripCount={trips.length} />
      <div className="app-main">
        <main className="page">
          <Routes>
            <Route path="/" element={<Home trips={trips} />} />
            <Route path="/explore" element={<ExploreDestinations />} />
            <Route
              path="/trips"
              element={
                <MyTrips
                  trips={trips}
                  addTrip={addTrip}
                  deleteTrip={deleteTrip}
                />
              }
            />
            <Route
              path="/itinerary"
              element={
                <ItineraryBuilder trips={trips} updateTrip={updateTrip} />
              }
            />
            <Route
              path="/itinerary/:tripId"
              element={
                <ItineraryBuilder trips={trips} updateTrip={updateTrip} />
              }
            />
            <Route
              path="/budget"
              element={<BudgetPlanner trips={trips} updateTrip={updateTrip} />}
            />
            <Route
              path="/budget/:tripId"
              element={<BudgetPlanner trips={trips} updateTrip={updateTrip} />}
            />
            <Route
              path="/packing"
              element={
                <PackingChecklist trips={trips} updateTrip={updateTrip} />
              }
            />
            <Route
              path="/packing/:tripId"
              element={
                <PackingChecklist trips={trips} updateTrip={updateTrip} />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}
