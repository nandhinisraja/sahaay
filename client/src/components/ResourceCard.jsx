import {
  MapPin,
  Phone,
  Clock,
  Bookmark,
  Share2,
  Navigation,
  Globe
} from "lucide-react";

import "./ResourceCard.css";

function ResourceCard({
  resource,
  saved = false,
  onSave
}) {

  const name =
    resource.title ||
    resource.name ||
    "Resource";

  const address =
    resource.location ||
    resource.address ||
    "Address not available";

  const phone =
    resource.phone ||
    "Phone number not available";

  const website =
    resource.website || "";

  const openingHours =
    resource.availability ||
    resource.openingHours ||
    "Opening hours not available";

  const type =
    resource.type ||
    resource.category ||
    "Resource";

  const description =
    resource.description ||
    `Nearby ${type.toLowerCase()} available around your selected location.`;

  const mapUrl =
    resource.mapUrl ||
    (
      resource.latitude &&
      resource.longitude
        ? `https://www.google.com/maps/search/?api=1&query=${resource.latitude},${resource.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
    );


  // ---------------------------------------------------------
  // DIRECTIONS
  // ---------------------------------------------------------

  const handleDirections = () => {
    window.open(
      mapUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };


  // ---------------------------------------------------------
  // CALL
  // ---------------------------------------------------------

  const handleCall = () => {

    if (
      !resource.phone ||
      resource.phone === "Phone number not available"
    ) {
      alert(`Phone number is not available for this ${type.toLowerCase()}.`);
      return;
    }

    window.location.href =
      `tel:${resource.phone}`;
  };


  // ---------------------------------------------------------
  // WEBSITE
  // ---------------------------------------------------------

  const handleWebsite = () => {

    if (!website) {
      alert("Website is not available.");
      return;
    }

    const url =
      website.startsWith("http")
        ? website
        : `https://${website}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };


  // ---------------------------------------------------------
  // SHARE
  // ---------------------------------------------------------

  const handleShare = async () => {

    const shareText =
      `${name}\n${address}\n${phone}`;

    try {

      if (navigator.share) {

        await navigator.share({
          title: name,
          text: shareText,
          url: mapUrl
        });

      } else {

        await navigator.clipboard.writeText(
          `${name}\n${address}\n${phone}\n${mapUrl}`
        );

        alert(`${type} details copied!`);

      }

    } catch (error) {

      console.log("Share cancelled.");

    }
  };


  return (

    <article className="resource-card">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="resource-card-top">

        <span className="resource-type">
          {type}
        </span>

        <button
          type="button"
          className={
            saved
              ? "save-button saved"
              : "save-button"
          }
          onClick={onSave}
          title={`Save ${type.toLowerCase()}`}
        >

          <Bookmark
            size={19}
            fill={
              saved
                ? "currentColor"
                : "none"
            }
          />

        </button>

      </div>


      {/* =====================================================
          RESOURCE NAME
      ===================================================== */}

      <h3 className="resource-title">
        {name}
      </h3>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <p className="resource-description">
        {description}
      </p>


      {/* =====================================================
          RESOURCE DETAILS
      ===================================================== */}

      <div className="resource-details">


        {/* ADDRESS */}

        <div className="resource-detail">

          <MapPin size={18} />

          <span>
            <strong>Address:</strong>{" "}
            {address}
          </span>

        </div>


        {/* PHONE */}

        <div className="resource-detail">

          <Phone size={18} />

          <span>
            <strong>Phone:</strong>{" "}
            {phone}
          </span>

        </div>


        {/* OPENING HOURS */}

        <div className="resource-detail">

          <Clock size={18} />

          <span>
            <strong>Hours:</strong>{" "}
            {openingHours}
          </span>

        </div>


        {/* WEBSITE */}

        {website && (

          <div className="resource-detail">

            <Globe size={18} />

            <button
              type="button"
              onClick={handleWebsite}
              className="website-button"
            >

              Visit Website

            </button>

          </div>

        )}

      </div>


      {/* =====================================================
          LOCATION
      ===================================================== */}

      {resource.latitude &&
       resource.longitude && (

        <div className="resource-meta">

          <span>

            📍 Coordinates:

            {" "}

            {resource.latitude.toFixed
              ? resource.latitude.toFixed(5)
              : resource.latitude}

            {", "}

            {resource.longitude.toFixed
              ? resource.longitude.toFixed(5)
              : resource.longitude}

          </span>

        </div>

      )}


      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="resource-actions">

        <button
          type="button"
          onClick={handleDirections}
        >

          <Navigation size={16} />

          Directions

        </button>


        <button
          type="button"
          onClick={handleCall}
        >

          <Phone size={16} />

          Call

        </button>


        <button
          type="button"
          onClick={handleShare}
        >

          <Share2 size={16} />

          Share

        </button>

      </div>

    </article>
  );
}

export default ResourceCard;