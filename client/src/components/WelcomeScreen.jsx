import {
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Users
} from "lucide-react";

function WelcomeScreen({ onStart }) {
  return (
    <main className="welcome-page" id="home">

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <HeartHandshake size={18} />
            Community Support Platform
          </div>

          <h1>
            Welcome to
            <span> SAHAAY</span>
          </h1>

          <p>
            Find the help, resources and support you need
            quickly, simply and in one place.
          </p>

          <button
            className="start-button"
            onClick={onStart}
          >
            Get Started
            <ArrowRight size={20} />
          </button>

        </div>

        <div className="hero-illustration">

          <div className="hero-circle">
            <HeartHandshake size={85} />
          </div>

          <div className="floating-card floating-one">
            <ShieldCheck size={25} />

            <div>
              <strong>Trusted Resources</strong>
              <span>Useful support</span>
            </div>
          </div>

          <div className="floating-card floating-two">
            <MapPin size={25} />

            <div>
              <strong>Nearby Help</strong>
              <span>Find resources</span>
            </div>
          </div>

          <div className="floating-card floating-three">
            <Users size={25} />

            <div>
              <strong>Community</strong>
              <span>Connect & support</span>
            </div>
          </div>

        </div>

      </section>

      <section className="feature-section">

        <div className="feature-box">
          <HeartHandshake size={30} />
          <h3>Easy to Use</h3>
          <p>
            Tell SAHAAY what kind of help you need.
          </p>
        </div>

        <div className="feature-box">
          <MapPin size={30} />
          <h3>Nearby Resources</h3>
          <p>
            Find helpful resources based on location.
          </p>
        </div>

        <div className="feature-box">
          <ShieldCheck size={30} />
          <h3>Organized Support</h3>
          <p>
            Access resources in one simple platform.
          </p>
        </div>

      </section>

    </main>
  );
}

export default WelcomeScreen;