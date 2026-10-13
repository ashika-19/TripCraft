import { Link, useParams } from "react-router-dom";
import { Briefcase } from "lucide-react";

import { TripBanner, TripPicker } from "../components/TripCard.jsx";
import ItineraryDay from "../components/ItineraryDay.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { addDays, getDayCount } from "../utils/formatters.js";
import { generateId } from "../utils/storage.js";

export default function ItineraryBuilder({ trips, updateTrip }) {
  const { tripId } = useParams();
  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <>
        <div className="page-header">
          <div>
            <span className="eyebrow">Itinerary</span>
            <h1>Itinerary builder</h1>
            <p>Choose a trip to plan it day by day.</p>
          </div>
        </div>
        {trips.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No trips to plan yet"
            text="Create a trip first, then build its itinerary here."
          >
            <Link to="/trips?new=bali" className="btn btn-primary">
              Create a trip
            </Link>
            <Link to="/explore" className="btn btn-ghost">
              Explore destinations
            </Link>
          </EmptyState>
        ) : (
          <TripPicker trips={trips} basePath="/itinerary" />
        )}
      </>
    );
  }

  const itinerary = trip.itinerary || {};
  const dayCount = getDayCount(trip);
  const totalActivities = Object.values(itinerary).reduce(
    (sum, list) => sum + list.length,
    0,
  );

  const addActivity = (day, activity) => {
    updateTrip(trip.id, {
      itinerary: {
        ...itinerary,
        [day]: [...(itinerary[day] || []), { id: generateId(), ...activity }],
      },
    });
  };

  const removeActivity = (day, id) => {
    updateTrip(trip.id, {
      itinerary: {
        ...itinerary,
        [day]: (itinerary[day] || []).filter((a) => a.id !== id),
      },
    });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <span className="eyebrow">Itinerary</span>
          <h1>Itinerary builder</h1>
          <p>
            {dayCount} days · {totalActivities}{" "}
            {totalActivities === 1 ? "activity" : "activities"} planned
          </p>
        </div>
      </div>

      <TripPicker trips={trips} basePath="/itinerary" activeId={trip.id} />
      <TripBanner trip={trip} />

      <div className="day-list">
        {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
          <ItineraryDay
            key={day}
            day={day}
            date={addDays(trip.startDate, day - 1)}
            activities={itinerary[day] || []}
            onAdd={addActivity}
            onRemove={removeActivity}
          />
        ))}
      </div>
    </>
  );
}
