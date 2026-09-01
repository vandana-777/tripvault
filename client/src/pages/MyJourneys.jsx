import { useEffect, useState } from "react";
import { getUser } from "../services/authService";
import { getTrips, deleteTrip } from "../services/tripService";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { getDestinationImage } from "../utils/destinationImages";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

function MyJourneys() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [tripError, setTripError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavourites, setShowFavourites] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("tripFavorites");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoadingTrips(true);
      setTripError("");
      const token = localStorage.getItem("token");
      const response = await getTrips(token);
      setTrips(response.data);
    } catch (error) {
      console.error("Fetch Trips Error:", error);
      setTripError(error.response?.data?.message || "Unable to load your trips.");
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

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const token = localStorage.getItem("token");
      await deleteTrip(token, tripId);
      toast.success("Trip deleted successfully!");
      await fetchTrips();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete the trip.");
    }
  };

  const toggleFavorite = (tripId) => {
    setFavorites((prev) => {
      const updated = prev.includes(tripId)
        ? prev.filter((id) => id !== tripId)
        : [...prev, tripId];

      localStorage.setItem("tripFavorites", JSON.stringify(updated));
      return updated;
    });
  };

  const totalTrips = trips.length;
  const ratedTrips = trips.filter((trip) => trip.rating);
  const averageRating = ratedTrips.length
    ? (ratedTrips.reduce((sum, trip) => sum + Number(trip.rating), 0) / ratedTrips.length).toFixed(1)
    : "—";
  const uniqueDestinations = new Set(
    trips
      .map((trip) => trip.destination?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const filteredTrips = trips.filter((trip) => {
    const search = searchTerm.toLowerCase().trim();
    const title = (trip.title || "").toLowerCase();
    const destination = (trip.destination || "").toLowerCase();
    const matchesSearch = title.includes(search) || destination.includes(search);
    const matchesFavourite = !showFavourites || favorites.includes(trip._id);
    return matchesSearch && matchesFavourite;
  });

  const formatDate = (date) => {
    if (!date) return "Date not specified";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard-page my-journeys-page">
      <header className="journeys-topbar">
        <button className="journeys-brand" onClick={() => navigate("/dashboard")}>
          <span>✈️</span> TripVault
        </button>

        <button className="journeys-back-btn" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
      </header>

      <main className="my-journeys-main">
        <section className="journeys-title-row">
          <div>
            <p className="section-label">YOUR TRAVEL MEMORIES</p>
            <h1>My Journeys</h1>
          </div>

          <button className="create-trip-btn" onClick={() => navigate("/trips/create")}>
            <span>+</span> Create Trip
          </button>
        </section>

        <section className="travel-summary">
          <div className="summary-card">
            <div className="summary-icon blue">🧳</div>
            <div><h3>{totalTrips}</h3><p>Total Trips</p></div>
          </div>

          <div className="summary-card">
            <div className="summary-icon yellow">⭐</div>
            <div><h3>{averageRating}</h3><p>Rating</p></div>
          </div>

          <div className="summary-card">
            <div className="summary-icon green">🌍</div>
            <div><h3>{uniqueDestinations}</h3><p>Places Visited</p></div>
          </div>
        </section>

        <div className="journey-search-row">
          <div className="journey-search">
            <span>🔎</span>
            <input
              type="text"
              placeholder="Search your journeys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="journey-controls">
          <div className="trip-tabs">
            <button className={!showFavourites ? "active-tab" : ""} onClick={() => setShowFavourites(false)}>
              All Trips
            </button>
            <button className={showFavourites ? "active-tab favourite-tab" : ""} onClick={() => setShowFavourites(true)}>
              ❤️ Favourites
            </button>
          </div>
          <p className="trip-count">{filteredTrips.length} journey{filteredTrips.length !== 1 ? "s" : ""}</p>
        </div>

        {loadingTrips ? (
          <div className="trip-status"><div className="loading-icon">✈️</div><p>Loading your journeys...</p></div>
        ) : tripError ? (
          <div className="trip-status error"><p>{tripError}</p><button onClick={fetchTrips}>Try Again</button></div>
        ) : filteredTrips.length === 0 ? (
          <div className="no-journey-placeholder" aria-hidden="true"></div>
        ) : (
          <div className="trip-grid">
            {filteredTrips.map((trip) => (
              <article className="trip-card" key={trip._id}>
                <div className="trip-image-wrapper">
                  <img
                    src={trip.coverImage || getDestinationImage(trip.destination)}
                    alt={trip.destination}
                    className="trip-image"
                  />
                  <button
                    className={`favourite-btn ${favorites.includes(trip._id) ? "favourited" : ""}`}
                    onClick={() => toggleFavorite(trip._id)}
                    title={favorites.includes(trip._id) ? "Remove from favourites" : "Add to favourites"}
                  >
                    {favorites.includes(trip._id) ? "♥" : "♡"}
                  </button>
                </div>

                <div className="trip-card-content">
                  <h3>{trip.title}</h3>
                  <p className="trip-destination">📍 {trip.destination}</p>
                  <p className="trip-dates">📅 {formatDate(trip.startDate)} — {formatDate(trip.endDate)}</p>

                  {trip.description && <p className="trip-description">{trip.description}</p>}

                  <div className="trip-card-footer">
                    <span className="trip-rating">
                      {trip.rating ? `⭐ ${trip.rating}` : "No rating"}
                    </span>
                    <button className="view-trip-btn" onClick={() => navigate(`/trips/${trip._id}`)}>
                      View Journey →
                    </button>
                  </div>

                  <div className="trip-actions">
                    <button className="icon-action edit-action" title="Edit trip" onClick={() => navigate(`/trips/edit/${trip._id}`)}>✏️</button>
                    <button className="icon-action delete-action" title="Delete trip" onClick={() => handleDelete(trip._id)}>🗑️</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyJourneys;
