import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DiscoverTravelers() {
  const navigate = useNavigate();

  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTravelers = async () => {
      try {
        const response = await axios.get(
          "https://tripvault-2pmy.onrender.com/api/auth/profiles"
        );

        setTravelers(response.data);
      } catch (error) {
        console.error("Fetch Travelers Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load travelers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTravelers();
  }, []);

  if (loading) {
    return (
      <div className="discover-page">
        <p>✈️ Finding travelers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discover-page">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="discover-page">

      <button
        className="discover-back"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Journeys
      </button>

      <div className="discover-header">
        <span>TRIPVAULT COMMUNITY</span>

        <h1>Discover Travelers 🌍</h1>

        <p>
          Explore journeys and discover the people
          behind them.
        </p>
      </div>

      {travelers.length === 0 ? (
        <div className="discover-empty">
          <p>No travelers found.</p>
        </div>
      ) : (
        <div className="traveler-grid">

          {travelers.map((traveler) => (
            <article
              className="traveler-card"
              key={traveler._id}
            >

              <div className="traveler-avatar">
                {traveler.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <h2>{traveler.name}</h2>

              {traveler.bio && (
                <p>{traveler.bio}</p>
            )}

              <button
                className="view-profile-btn"
                onClick={() =>
                  navigate(
                    `/profile/${traveler._id}`
                  )
                }
              >
                View Profile →
              </button>

            </article>
          ))}

        </div>
      )}

    </div>
  );
}

export default DiscoverTravelers;
