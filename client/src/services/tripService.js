import axios from "axios";

const API_URL = "http://localhost:5000/api/trips";

export const getTrips = (token) => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createTrip = (token, tripData) => {
  return axios.post(API_URL, tripData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTrip = (token, tripId) => {
  return axios.get(`${API_URL}/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTrip = (token, tripId, tripData) => {
  return axios.put(`${API_URL}/${tripId}`, tripData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTrip = (token, tripId) => {
  return axios.delete(`${API_URL}/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadTripPhoto = (token, tripId, photo) => {
  const formData = new FormData();

  formData.append("image", photo);

  return axios.post(
    `${API_URL}/${tripId}/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};