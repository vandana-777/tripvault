import { useState } from "react";
import { createTrip } from "../services/tripService";

function TripForm({ onTripCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    rating: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!formData.title || !formData.destination) {
      setError("Please enter the trip title and destination.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await createTrip(token, {
        ...formData,
        rating: formData.rating ? Number(formData.rating) : undefined,
      });

      onTripCreated();
    } catch (error) {
      console.error("Create Trip Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create the trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-form-container">
      <div className="trip-form-card">
        <h2>✈️ Create a New Trip</h2>
        <p className="form-subtitle">
          Save your journey and preserve the memory.
        </p>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Trip Title *</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Goa Getaway"
            value={formData.title}
            onChange={handleChange}
          />

          <label>Destination *</label>
          <input
            type="text"
            name="destination"
            placeholder="e.g. Goa, India"
            value={formData.destination}
            onChange={handleChange}
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
            placeholder="Write something about your trip..."
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
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-trip-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Trip ✈️"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripForm;