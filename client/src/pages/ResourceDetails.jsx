import {
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Navigation
} from "lucide-react";

function ResourceDetails({ resource }) {

  if (!resource) {
    return (
      <div className="resource-details-page">
        <h2>Resource not found</h2>
      </div>
    );
  }

  const openDirections = () => {

    const query = encodeURIComponent(
      `${resource.title}, ${resource.location}`
    );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <main className="resource-details-page">

      <div className="resource-details-container">

        <span className="resource-category">
          {resource.category}
        </span>

        <h1>
          {resource.title}
        </h1>

        <p className="details-description">
          {resource.description}
        </p>

        <div className="details-info">

          <div>
            <MapPin />
            <section>
              <strong>Location</strong>
              <span>{resource.location}</span>
            </section>
          </div>

          <div>
            <Clock />
            <section>
              <strong>Availability</strong>
              <span>{resource.availability}</span>
            </section>
          </div>

          <div>
            <Phone />
            <section>
              <strong>Phone</strong>
              <span>{resource.phone}</span>
            </section>
          </div>

          <div>
            <CheckCircle />
            <section>
              <strong>Eligibility</strong>
              <span>{resource.eligibility}</span>
            </section>
          </div>

        </div>

        <button
          className="direction-button"
          onClick={openDirections}
        >
          <Navigation size={18} />
          Get Directions
        </button>

      </div>

    </main>
  );
}

export default ResourceDetails;