import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getDestinationImage } from "../utils/destinationImages";

function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://tripvault-2pmy.onrender.com/api/auth/profile/${id}`
        );

        setProfile(response.data);
      } catch (error) {
        console.error("Public Profile Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load this profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="public-profile-page">
        <p>✈️ Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="public-profile-page">
        <p>{error || "Profile not found."}</p>

        <button onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="public-profile-page">

      <button
        className="public-profile-back"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Journeys
      </button>

      <div className="public-profile-header">

        <div className="profile-avatar">
          {profile.user.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1>{profile.user.name}</h1>

          {profile.user.bio && (
            <p>{profile.user.bio}</p>
          )}
        </div>

      </div>

      <div className="public-profile-stats">
        <span>
          <strong>{profile.trips.length}</strong> Journeys
        </span>
      </div>

      <section className="public-profile-trips">

        <h2>Journeys ✈️</h2>

        {profile.trips.length === 0 ? (
          <p>
            This traveler hasn't shared any journeys yet.
          </p>
        ) : (
          <div className="public-trip-grid">

            {profile.trips.map((trip) => (
              <article
                className="public-trip-card"
                key={trip._id}
                onClick={() => navigate(`/trips/${trip._id}`)}
              >

                
                  <div className="public-trip-image">
                   <img src={
                    trip.coverImage ||
                    getDestinationImage(trip.destination)
                }
                alt={trip.destination}
                className="trip-image"
                />
                  </div>
            
                <div className="public-trip-content">

                  <h3>{trip.title}</h3>

                  <p>
                    📍 {trip.destination}
                  </p>

                  {trip.rating && (
                    <p>
                      {"⭐".repeat(trip.rating)}
                    </p>
                  )}

                  {trip.description && (
                    <p className="public-trip-description">
                      {trip.description}
                    </p>
                  )}

                </div>

              </article>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default PublicProfile;