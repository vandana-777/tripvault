import { useEffect, useState } from "react";
import { getUser } from "../services/authService";
import {
  getTrips,
  deleteTrip,
} from "../services/tripService";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { getDestinationImage } from "../utils/destinationImages";
function MyJourneys() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [tripError, setTripError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavourites, setShowFavourites] = useState(false);
  const [favorites, setFavorites] = useState(() => {
  const savedFavorites = localStorage.getItem("tripFavorites");
  return savedFavorites ? JSON.parse(savedFavorites) : [];
});

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

  /* ================================
     Favourite Trips
  ================================= */

  const getFavouriteTrips = () => {
    return JSON.parse(
      localStorage.getItem("tripvault_favourites") || "[]"
    );
  };

  const [favourites, setFavourites] = useState(
    getFavouriteTrips()
  );

  const toggleFavourite = (tripId) => {
    let updatedFavourites;

    if (favourites.includes(tripId)) {
      updatedFavourites = favourites.filter(
        (id) => id !== tripId
      );
    } else {
      updatedFavourites = [...favourites, tripId];
    }

    setFavourites(updatedFavourites);

    localStorage.setItem(
      "tripvault_favourites",
      JSON.stringify(updatedFavourites)
    );
  };

  /* ================================
     Statistics
  ================================= */

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

  /* ================================
     Search + Favourite Filter
  ================================= */

  const filteredTrips = trips.filter((trip) => {
  const search = searchTerm.toLowerCase().trim();

  const matchesSearch =
    trip.title.toLowerCase().includes(search) ||
    trip.destination.toLowerCase().includes(search);

  const matchesFavourite =
    !showFavourites ||
    favorites.includes(trip._id);

  return matchesSearch && matchesFavourite;
});

  /* ================================
     Date Formatting
  ================================= */

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

  const toggleFavorite = (tripId) => {
  setFavorites((prev) => {
    const updatedFavorites = prev.includes(tripId)
      ? prev.filter((id) => id !== tripId)
      : [...prev, tripId];

    localStorage.setItem(
      "tripFavorites",
      JSON.stringify(updatedFavorites)
    );

    return updatedFavorites;
  });
};

  return (
    <div className="dashboard-page">

      {/* =================================
          HERO SECTION
      ================================= */}

      <section className="hero-section">

        <div className="hero-overlay"></div>

        <nav className="hero-navbar">
           <div className="brand">
    <span className="brand-icon">✈️</span>
    <span>TripVault</span>
  </div>

  <div className="hero-nav-actions">

    <button
      className="discover-nav-btn"
      onClick={() => navigate("/discover")}
    >
      🌍 Discover Travelers
    </button>

    <button
      className="hero-logout"
      onClick={handleLogout}
    >
      Logout
    </button>

  </div>

</nav>


        <div className="hero-content">

          <p className="hero-small-text">
            YOUR TRAVEL JOURNAL
          </p>

          <h1>
            Collect moments,
            <br />
            not just miles.
          </h1>

          <p className="hero-description">
            Keep your journeys, memories and
            favourite destinations all in one place.
          </p>

          <div className="hero-search">

            <span>🔎</span>

            <input
              type="text"
              placeholder="Search your journeys..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>

      </section>

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <main className="dashboard-main">

        {/* Welcome */}

        <div className="welcome-section">

          <div>
            <p className="welcome-label">
              Welcome back
            </p>

            <h2>
              👋 {user?.name || "Traveler"}
            </h2>

            {user && (
              <p className="user-email">
                {user.email}
              </p>
            )}
          </div>

        </div>

        {/* =================================
            STATISTICS
        ================================= */}

        <div className="travel-summary">

          <div className="summary-card">
            <div className="summary-icon blue">
              🧳
            </div>

            <div>
              <h3>{totalTrips}</h3>
              <p>Total Trips</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon yellow">
              ⭐
            </div>

            <div>
              <h3>{averageRating}</h3>
              <p>Average Rating</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon green">
              🌍
            </div>

            <div>
              <h3>{uniqueDestinations}</h3>
              <p>Places Visited</p>
            </div>
          </div>

        </div>

        {/* =================================
            JOURNEYS HEADER
        ================================= */}

        <div className="journeys-header">

          <div>
            <p className="section-label">
              YOUR COLLECTION
            </p>

            <h2>🌍 My Journeys</h2>

            <p className="section-description">
              Your favourite places and unforgettable memories.
            </p>
          </div>

          <button
            className="create-trip-btn"
            onClick={() => navigate("/trips/create")}
          >
            <span>+</span>
            Create Trip
          </button>

        </div>

        {/* =================================
            FILTERS
        ================================= */}

        <div className="journey-controls">

          <div className="trip-tabs">

            <button
              className={
                !showFavourites
                  ? "active-tab"
                  : ""
              }
              onClick={() =>
                setShowFavourites(false)
              }
            >
              All Trips
            </button>

            <button
              className={
                showFavourites
                  ? "active-tab favourite-tab"
                  : ""
              }
              onClick={() =>
                setShowFavourites(true)
              }
            >
              ❤️ Favourites
            </button>

          </div>

          <p className="trip-count">
            {filteredTrips.length} journey
            {filteredTrips.length !== 1 ? "s" : ""}
          </p>

        </div>

        {/* =================================
            TRIP CONTENT
        ================================= */}

        {loadingTrips ? (

          <div className="trip-status">
            <div className="loading-icon">✈️</div>
            <p>Loading your journeys...</p>
          </div>

        ) : tripError ? (

          <div className="trip-status error">
            <p>{tripError}</p>

            <button onClick={fetchTrips}>
              Try Again
            </button>
          </div>

        ) : trips.length === 0 ? (

          <div className="empty-trips">

            <div className="empty-icon">
              🧳
            </div>

            <h3>No journeys yet</h3>

            <p>
              Your travel memories are waiting
              to be created.
            </p>

            <button
              className="empty-create-btn"
              onClick={() =>
                navigate("/trips/create")
              }
            >
              + Start Your First Trip
            </button>

          </div>

        ) : filteredTrips.length === 0 ? (

          <div className="empty-trips">

            <div className="empty-icon">
              {showFavourites ? "❤️" : "🔎"}
            </div>

            <h3>
              {showFavourites
                ? "No favourite trips yet"
                : "No trips found"}
            </h3>

            <p>
              {showFavourites
                ? "Tap the heart on a trip to save it here."
                : `We couldn't find a journey matching "${searchTerm}".`}
            </p>

          </div>

        ) : (

          <div className="trip-grid">

            {filteredTrips.map((trip, index) => (

              <article
                className="trip-card"
                key={trip._id}
              >
                {/* Trip Image */}
<div className="trip-image-wrapper">

  <img
    src={trip.coverImage || getDestinationImage(trip.destination)}
    alt={trip.destination}
    className="trip-image"
  />

  <button
  className={`favourite-btn ${
    favorites.includes(trip._id) ? "favourited" : ""
  }`}
  onClick={() => toggleFavorite(trip._id)}
  title={
    favorites.includes(trip._id)
      ? "Remove from favourites"
      : "Add to favourites"
  }
>
  
  {favorites.includes(trip._id) ? "♥" : "♡"}

  </button>

</div>

{/* Trip Details */}
<div className="trip-card-content">

  <h3>{trip.title}</h3>

  <p className="trip-destination">
    📍 {trip.destination}
  </p>

  <p className="trip-dates">
    📅 {formatDate(trip.startDate)}
    {" — "}
    {formatDate(trip.endDate)}
  </p>

  {trip.description && (
    <p className="trip-description">
      {trip.description}
    </p>
  )}

  <div className="trip-card-footer">

    <span className="trip-rating">
      {trip.rating
        ? "⭐".repeat(trip.rating)
        : "No rating"}
    </span>

    <button
  className="view-trip-btn"
  onClick={() =>
    navigate(`/trips/${trip._id}`)
  }
>
  View Journey →
</button>

    <div className="trip-actions">

      <button
        className="icon-action edit-action"
        title="Edit trip"
        onClick={() =>
          navigate(`/trips/edit/${trip._id}`)
        }
      >
        ✏️
      </button>

      <button
        className="icon-action delete-action"
        title="Delete trip"
        onClick={() =>
          handleDelete(trip._id)
        }
      >
        🗑️
      </button>

    </div>


  </div>

</div>

                

              </article>

            ))}

          </div>

        )}

      </main>

      {/* =================================
          FOOTER
      ================================= */}

      <footer className="dashboard-footer">
        <div className="footer-brand">
          ✈️ TripVault
        </div>

        <p>
          Your journeys. Your memories. Your story.
        </p>
      </footer>

    </div>
  );
}

export default MyJourneys;