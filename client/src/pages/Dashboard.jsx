import { useEffect, useState } from "react";
import { getUser } from "../services/authService";
import {
  getTrips,
  deleteTrip,
} from "../services/tripService";
import { useNavigate } from "react-router-dom";
import TripForm from "../components/TripForm";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [tripError, setTripError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchTrips = async () => {
    try {
      setLoadingTrips(true);
      setTripError("");

      const token = localStorage.getItem("token");
      const response = await getTrips(token);

      setTrips(response.data);
    } catch (error) {
      console.error("Fetch Trips Error:", error);

      setTripError(
        error.response?.data?.message ||
          "Unable to load your trips."
      );
    } finally {
      setLoadingTrips(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getUser(token);

        setUser(response.data);
      } catch (error) {
        console.error("Fetch User Error:", error);
      }
    };

    fetchUser();
    fetchTrips();
  }, []);

  const handleTripCreated = async () => {
    setShowForm(false);
    await fetchTrips();
  };

  const handleDelete = async (tripId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await deleteTrip(token, tripId);

      await fetchTrips();
    } catch (error) {
      console.error("Delete Trip Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete the trip."
      );
    }
  };

  // Dashboard statistics
  const totalTrips = trips.length;

  const ratedTrips = trips.filter(
    (trip) => trip.rating
  );

  const averageRating =
    ratedTrips.length > 0
      ? (
          ratedTrips.reduce(
            (sum, trip) => sum + trip.rating,
            0
          ) / ratedTrips.length
        ).toFixed(1)
      : "—";

  const uniqueDestinations = new Set(
    trips.map((trip) =>
      trip.destination.trim().toLowerCase()
    )
  ).size;

  // Search trips by title or destination
  const filteredTrips = trips.filter((trip) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      trip.title.toLowerCase().includes(search) ||
      trip.destination.toLowerCase().includes(search)
    );
  });

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1>✈️ TripVault</h1>

            {user && (
              <>
                <h2>👋 Welcome, {user.name}</h2>
                <p>📧 {user.email}</p>
              </>
            )}
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Travel Summary */}
        <div className="travel-summary">
          <div className="summary-card">
            <span className="summary-icon">🧳</span>

            <div>
              <h3>{totalTrips}</h3>
              <p>Total Trips</p>
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-icon">⭐</span>

            <div>
              <h3>{averageRating}</h3>
              <p>Average Rating</p>
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-icon">🌍</span>

            <div>
              <h3>{uniqueDestinations}</h3>
              <p>Places Visited</p>
            </div>
          </div>
        </div>

        {/* My Journeys Header */}
        <div className="trip-section-header">
          <div>
            <h2>🌍 My Journeys</h2>

            <p>
              Keep your favorite travel memories in one place.
            </p>
          </div>

          <div className="trip-search">
            <input
              type="text"
              placeholder="🔎 Search trips..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <button
            className="create-trip-btn"
            onClick={() => setShowForm(true)}
          >
            + Create Trip
          </button>
        </div>

        {/* Create Trip Form */}
        {showForm && (
          <TripForm
            onTripCreated={handleTripCreated}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Trip Content */}
        {loadingTrips ? (
          <div className="trip-status">
            <p>✈️ Loading your journeys...</p>
          </div>
        ) : tripError ? (
          <div className="trip-status error">
            <p>{tripError}</p>

            <button onClick={fetchTrips}>
              Try Again
            </button>
          </div>
        ) : trips.length === 0 ? (
          /* No trips at all */
          <div className="empty-trips">
            <div className="empty-icon">🧳</div>

            <h3>No journeys yet</h3>

            <p>
              Your travel memories are waiting to be created.
            </p>

            <p>
              Click <strong>+ Create Trip</strong> above to
              add your first journey.
            </p>
          </div>
        ) : filteredTrips.length === 0 ? (
          /* Trips exist, but search has no match */
          <div className="empty-trips">
            <div className="empty-icon">🔎</div>

            <h3>No trips found</h3>

            <p>
              We couldn't find a journey matching "
              {searchTerm}".
            </p>
          </div>
        ) : (
          /* Trip Cards */
          <div className="trip-grid">
            {filteredTrips.map((trip) => (
              <div
                className="trip-card"
                key={trip._id}
              >
                <div className="trip-card-top">
                  <h3>🌴 {trip.title}</h3>

                  {trip.rating && (
                    <span className="trip-rating">
                      {"⭐".repeat(trip.rating)}
                    </span>
                  )}
                </div>

                <p className="trip-destination">
                  📍 {trip.destination}
                </p>

                <p className="trip-dates">
                  📅 {formatDate(trip.startDate)} →{" "}
                  {formatDate(trip.endDate)}
                </p>

                {trip.description && (
                  <p className="trip-description">
                    {trip.description}
                  </p>
                )}

                <div className="trip-actions">
                  <button
                    className="edit-trip-btn"
                    onClick={() =>
                      navigate(
                        `/trips/edit/${trip._id}`
                      )
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-trip-btn"
                    onClick={() =>
                      handleDelete(trip._id)
                    }
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;