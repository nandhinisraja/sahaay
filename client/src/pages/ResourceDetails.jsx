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
          {resource.category || "Resource"}
        </span>

        <h1>
          {resource.title || "Untitled resource"}
        </h1>

        <p className="details-description">
          {resource.description ||
            "No description available for this resource."}
        </p>

        <div className="details-info">

          <div>
            <MapPin />
            <section>
              <strong>Location</strong>
              <span>{resource.location || "Not available"}</span>
            </section>
          </div>

          <div>
            <Clock />
            <section>
              <strong>Availability</strong>
              <span>{resource.availability || "Opening hours not available"}</span>
            </section>
          </div>

          <div>
            <Phone />
            <section>
              <strong>Phone</strong>
              <span>{resource.phone || "Phone number not available"}</span>
            </section>
          </div>

          {/*
            "eligibility" is only ever set for Scholarship-type resources
            (add it to convertApiResult() in Resources.jsx if you want it
            populated). It doesn't exist for hospitals/schools, so this
            row is hidden unless the data actually has it — otherwise it
            always rendered blank/undefined.
          */}
          {resource.eligibility && (
            <div>
              <CheckCircle />
              <section>
                <strong>Eligibility</strong>
                <span>{resource.eligibility}</span>
              </section>
            </div>
          )}

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