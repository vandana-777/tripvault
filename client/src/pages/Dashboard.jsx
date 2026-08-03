import { useEffect, useState } from "react";
import { getUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await getUser(token);

        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  return (
  <div className="dashboard-container">
    <div className="dashboard-card">

      <h1>✈️ TripVault Dashboard</h1>

      {user ? (
        <>
          <h2>👋 Welcome, {user.name}</h2>

          <p>📧 {user.email}</p>

          <div className="info-box">
            <h3>🎉 Week 1 Completed</h3>

            <p>
              You have successfully logged into TripVault.
            </p>

            <p>
              Your travel memories will appear here once you
              start creating trips in Week 2.
            </p>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}

    </div>
  </div>
);
}

export default Dashboard;