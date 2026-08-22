import { useEffect, useState } from "react";
import { getTrip, updateTrip, uploadTripPhoto } from "../services/tripService";
import { useNavigate, useParams } from "react-router-dom";
import { getDestinationImage } from "../utils/destinationImages";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    rating: "",
  });

  const [currentPhoto, setCurrentPhoto] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await getTrip(token, id);
        const trip = response.data;

        setFormData({
          title: trip.title || "",
          destination: trip.destination || "",
          startDate: trip.startDate
            ? trip.startDate.substring(0, 10)
            : "",
          endDate: trip.endDate
            ? trip.endDate.substring(0, 10)
            : "",
          description: trip.description || "",
          rating: trip.rating || "",
        });

        setCurrentPhoto(trip.coverImage || "");
      } catch (error) {
        console.error("Fetch Trip Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load the trip."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await updateTrip(token, id, {
  ...formData,
  rating: formData.rating
    ? Number(formData.rating)
    : undefined,
});

if (selectedPhoto) {
  await uploadTripPhoto(
    token,
    id,
    selectedPhoto
  );
}

navigate("/dashboard");
    } catch (error) {
      console.error("Update Trip Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update the trip."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="trip-status">
            <p>✈️ Loading trip...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="edit-page">

    {/* Background */}
    <div
      className="edit-background"
      style={{
        backgroundImage: `url(${getDestinationImage(
          formData.destination
        )})`,
      }}
    />

    {/* Top navigation */}
    <div className="edit-topbar">
      <button
        className="back-btn"
        type="button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Journeys
      </button>

      <div className="edit-brand">
        ✈️ TripVault
      </div>
    </div>

    {/* Edit content */}
    <div className="edit-page-content">

      <div className="edit-form-card">
       

        <div className="edit-form-content">

          <div className="edit-heading">
            <span className="edit-label">
              YOUR JOURNEY
            </span>

            <h1>Edit Your Trip</h1>

            <p>
              Update the details and keep your travel
              memories just the way you want them.
            </p>
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-field">
              <label>Trip Title *</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Kerala Adventures"
                required
              />
            </div>

            <div className="form-field">
              <label>Destination *</label>

              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Kerala, India"
                required
              />
            </div>

            <div className="edit-date-row">

              <div className="form-field">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-field">
              <label>Description</label>

              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write something about your trip..."
              />
            </div>

            <div className="form-field">
  <label>Trip Photo</label>

  {currentPhoto && (
    <div className="edit-current-photo">
      <img
        src={currentPhoto}
        alt="Current trip"
      />
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      setSelectedPhoto(e.target.files[0]);
    }}
  />
</div>

            <div className="form-field">
              <label>How was your trip?</label>

              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="">
                  Select rating
                </option>

                <option value="1">⭐ 1 — Not great</option>
                <option value="2">⭐⭐ 2 — Okay</option>
                <option value="3">⭐⭐⭐ 3 — Good</option>
                <option value="4">⭐⭐⭐⭐ 4 — Great</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 — Amazing!</option>
              </select>
            </div>

            <div className="edit-form-buttons">

              <button
                type="button"
                className="edit-cancel-btn"
                onClick={() => navigate("/dashboard")}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes ✈️"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  </div>
  );
}

export default EditTrip;