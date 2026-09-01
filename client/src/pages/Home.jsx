import Navbar from "../components/Navbar";
import travelImage from "../assets/travel.svg";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="home-page">
        <section className="home-hero">
          <img
            src={travelImage}
            alt="Travel memories"
            className="home-travel-image"
          />

          <h1>Capture Every Journey</h1>
          <h2>Preserve Every Memory</h2>

          <p className="home-signin-text">
            Sign in to continue your travel memory.
          </p>

          <div className="home-actions">
            <button onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button
              className="home-register-btn"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
