import Navbar from "../components/Navbar";
import travelImage from "../assets/travel.svg";
import FeatureCard from "../components/FeatureCard";
import { useNavigate } from "react-router-dom";

import "../styles/home.css";

function Home() {
    const navigate = useNavigate();
  return (
    <>
      <Navbar />

      <section className="hero">

        <div className="hero-left">
          <h1>Capture Every Journey</h1>

          <h2>Preserve Every Memory</h2>

          <p>
            Organize your trips, photos and unforgettable travel stories
            in one beautiful place.
          </p>

          <div className="buttons">
           <button onClick={() => navigate("/register")}>
            Get Started
           </button>
            <button className="secondary" onClick={() => window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
    })
  }
>
  Learn More
</button>
          </div>
        </div>

        <div className="hero-right">
          <img src={travelImage} alt="Travel" />
        </div>
      </section>

      <section className="features">

  <FeatureCard
    icon="🗺️"
    title="Plan Trips"
    description="Organize every journey with destinations, schedules and notes."
  />

  <FeatureCard
    icon="📷"
    title="Save Memories"
    description="Upload photos and preserve unforgettable travel moments."
  />

  <FeatureCard
    icon="📍"
    title="Track Destinations"
    description="Keep a record of every place you've visited around the world."
  />

</section>
    </>
  );
}

export default Home;