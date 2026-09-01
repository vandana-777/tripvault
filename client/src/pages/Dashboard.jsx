import { useEffect, useState } from "react";
import { getUser } from "../services/authService";
import {
  getTrips,
  deleteTrip,
} from "../services/tripService";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { getDestinationImage } from "../utils/destinationImages";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
        HEADER
    ================================= */}

    <header className="dashboard-header">

      <div className="dashboard-brand">
        <span>✈️</span>
        <strong>TripVault</strong>
      </div>

      <div className="profile-area">

        <button
          className="profile-toggle"
          onClick={() =>
            setShowProfileMenu(!showProfileMenu)
          }
        >
          👤 Profile
        </button>

        {showProfileMenu && (
          <div className="profile-dropdown">

            <div className="profile-info">

              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{user?.name || "Traveler"}</strong>

                <p>{user?.email || ""}</p>
              </div>

            </div>

            <div className="profile-divider"></div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-icon blue">🧳</span>
                <div>
                  <strong>{totalTrips}</strong>
                  <small>Total Trips</small>
                </div>
              </div>

              <div className="profile-stat">
                <span className="profile-stat-icon yellow">⭐</span>
                <div>
                  <strong>{averageRating}</strong>
                  <small>Rating</small>
                </div>
              </div>

              <div className="profile-stat">
                <span className="profile-stat-icon green">🌍</span>
                <div>
                  <strong>{uniqueDestinations}</strong>
                  <small>Places Visited</small>
                </div>
              </div>
            </div>

            <button
              className="dropdown-logout"
              onClick={handleLogout}
            >
              ↪ Logout
            </button>

          </div>
        )}

      </div>

    </header>


    {/* =================================
        WELCOME SECTION
    ================================= */}

    <main className="dashboard-home">

      <section className="home-welcome">

        <p>WELCOME BACK</p>

        <h1>
          👋 {user?.name || "Traveler"}!
        </h1>

        <span>
          Collect moments, not just miles.
        </span>

      </section>


      {/* =================================
          MAIN OPTIONS
      ================================= */}

      <section className="dashboard-navigation">

        <div
          className="dashboard-nav-card my-journeys-card"
          onClick={() => navigate("/my-journeys")}
        >

          <div className="dashboard-nav-icon">
            🧳
          </div>

          <h2>My Journeys</h2>

          <p>
            View your trips, memories and
            favourite destinations.
          </p>

          <button>
            Open →
          </button>

        </div>


        <div
          className="dashboard-nav-card discover-card"
          onClick={() => navigate("/discover")}
        >

          <div className="dashboard-nav-icon">
            🌍
          </div>

          <h2>Discover Travelers</h2>

          <p>
            Explore journeys and memories
            shared by other travelers.
          </p>

          <button>
            Explore →
          </button>

        </div>

      </section>

    </main>


    {/* =================================
        FOOTER
    ================================= */}

    <footer className="dashboard-footer">

      © 2025 TripVault. All rights reserved.

    </footer>

  </div>
);
}

export default Dashboard;