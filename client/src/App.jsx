import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EditTrip from "./components/EditTrip";
import TripForm from "./components/TripForm";
import TripDetail from "./pages/TripDetail";
import PublicProfile from "./pages/PublicProfile";
import DiscoverTravelers from "./pages/DiscoverTravelers";
import MyJourneys from "./pages/MyJourneys";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips/edit/:id"
            element={
              <ProtectedRoute>
                <EditTrip />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips/create"
            element={
              <ProtectedRoute>
                <TripForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute>
                <TripDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-journeys"
            element={
              <ProtectedRoute>
                <MyJourneys />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:id"
            element={<PublicProfile />}
          />

          <Route
            path="/discover"
            element={<DiscoverTravelers />}
          />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
      />
    </>
  );
}

export default App;