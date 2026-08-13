import { useEffect, useState } from "react";
import { getTrip, updateTrip } from "../services/tripService";
import { useNavigate, useParams } from "react-router-dom";

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
    <div className="dashboard-container">
      <div className="dashboard-card">

        <div className="trip-form-container">
          <div className="trip-form-card">
            <h2>✏️ Edit Your Trip</h2>

            <p className="form-subtitle">
              Update the details of your travel memory.
            </p>

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <label>Trip Title *</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Destination *</label>

              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />

              <div className="date-row">
                <div>
                  <label>Start Date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>End Date</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <label>Description</label>

              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />

              <label>Rating</label>

              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="">Select rating</option>
                <option value="1">⭐ 1</option>
                <option value="2">⭐⭐ 2</option>
                <option value="3">⭐⭐⭐ 3</option>
                <option value="4">⭐⭐⭐⭐ 4</option>
                <option value="5">⭐⭐⭐⭐⭐ 5</option>
              </select>

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/dashboard")}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-trip-btn"
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