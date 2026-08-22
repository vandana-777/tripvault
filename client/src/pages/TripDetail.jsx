import { useEffect, useState } from "react";
import { getTrip } from "../services/tripService";
import { useNavigate, useParams } from "react-router-dom";
import { getDestinationImage } from "../utils/destinationImages";

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await getTrip(token, id);

        setTrip(response.data);
      } catch (error) {
        console.error("Fetch Trip Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load this trip."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const formatDate = (date) => {
    if (!date) {
      return "Date not specified";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="trip-detail-page">
        <div className="trip-detail-status">
          <p>✈️ Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="trip-detail-page">
        <div className="trip-detail-status error">
          <p>{error || "Trip not found."}</p>

          <button onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="trip-detail-page">

    <button
      className="trip-detail-back"
      onClick={() => navigate("/dashboard")}
    >
      ← Back to Journeys
    </button>

    <div className="trip-detail-card">

      {/* Cover Photo */}
      <div className="trip-detail-cover">
        <img
          src={
            trip.coverImage ||
            getDestinationImage(trip.destination)
          }
          alt={trip.destination}
        />
      </div>

      {/* Trip Information */}
      <div className="trip-detail-content">

        <span className="trip-detail-label">
          YOUR JOURNEY
        </span>

        <h1>{trip.title}</h1>

        <p className="trip-detail-destination">
          📍 {trip.destination}
        </p>

        <p className="trip-detail-dates">
          📅 {formatDate(trip.startDate)}
          {" — "}
          {formatDate(trip.endDate)}
        </p>

        {trip.rating && (
          <p className="trip-detail-rating">
            {"⭐".repeat(trip.rating)}
          </p>
        )}

        {trip.description && (
          <div className="trip-detail-description">
            <h3>About this journey</h3>

            <p>{trip.description}</p>
          </div>
        )}

        {/* Photo Gallery */}
        {trip.photos && trip.photos.length > 0 && (
          <div className="trip-gallery">

            <div className="trip-gallery-heading">
              <div>
                <span>YOUR MEMORIES</span>
                <h2>Trip Photos 📸</h2>
              </div>

              <p>
                {trip.photos.length}{" "}
                {trip.photos.length === 1
                  ? "photo"
                  : "photos"}
              </p>
            </div>

            <div className="trip-gallery-grid">
              {trip.photos.map((photo, index) => (
                <div
                  className="trip-gallery-item"
                  key={`${photo}-${index}`}
                >
                  <img
                    src={photo}
                    alt={`${trip.title} memory ${index + 1}`}
                  />
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Actions */}
        <div className="trip-detail-actions">

          <button
            className="trip-detail-edit"
            onClick={() =>
              navigate(`/trips/edit/${trip._id}`)
            }
          >
            ✏️ Edit Journey
          </button>

          <button
            className="trip-detail-dashboard"
            onClick={() => navigate("/dashboard")}
          >
            Back to Journeys
          </button>

        </div>

      </div>

    </div>

  </div>
);
}

export default TripDetail;