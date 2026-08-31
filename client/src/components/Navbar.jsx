import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo" onClick={closeMenu}>
        ✈️ <span>TripVault</span>
      </Link>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/login" onClick={closeMenu}>
          Login
        </Link>

        <Link to="/register" onClick={closeMenu}>
          Register
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;