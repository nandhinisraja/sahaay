import {
  HeartHandshake,
  Home,
  BookOpen,
  Info
} from "lucide-react";

function Navbar({ onHome }) {
  return (
    <nav className="navbar">
      <button className="navbar-logo" onClick={onHome}>
        <div className="logo-box">
          <HeartHandshake size={24} />
        </div>

        <div className="logo-text">
          <h2>SAHAAY</h2>
          <span>Help • Connect • Empower</span>
        </div>
      </button>

      <div className="navbar-links">
        <button onClick={onHome}>
          <Home size={17} />
          Home
        </button>

        <a href="#resources">
          <BookOpen size={17} />
          Resources
        </a>

        <a href="#about">
          <Info size={17} />
          About
        </a>
      </div>
    </nav>
  );
}

export default Navbar;