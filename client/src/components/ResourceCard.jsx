import {
  MapPin,
  Phone,
  Clock,
  Bookmark,
  Share2,
  Navigation,
  Globe,
  Star
} from "lucide-react";

import "./ResourceCard.css";

function ResourceCard({
  resource,
  saved = false,
  onSave
}) {

  // ==========================================
  // DIRECTIONS
  // ==========================================

  const handleDirections = () => {

    // Use backend map URL if available
    if (resource.mapUrl) {
      window.open(resource.mapUrl, "_blank");
      return;
    }

    // Otherwise create Google Maps search
    const location =
      resource.address ||
      resource.location ||
      resource.name ||
      resource.title;

    if (!location) {
      alert("Location not available.");
      return;
    }

    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(location);

    window.open(url, "_blank");
  };


  // ==========================================
  // CALL
  // ==========================================

  const handleCall = () => {

    const phone =
      resource.phone;

    if (
      !phone ||
      phone === "Phone number not available"
    ) {
      alert("Phone number not available.");
      return;
    }

    window.location.href =
      `tel:${phone}`;
  };


  // ==========================================
  // SHARE
  // ==========================================

  const handleShare = async () => {

    const title =
      resource.name ||
      resource.title ||
      "SAHAAY Resource";

    const address =
      resource.address ||
      resource.location ||
      "";

    const shareData = {

      title: title,

      text:
        `${title}\n${address}\n\nFound using SAHAAY.`,

      url:
        resource.mapUrl ||
        window.location.href
    };


    try {

      if (navigator.share) {

        await navigator.share(
          shareData
        );

      } else {

        await navigator.clipboard.writeText(
          `${title}\n${address}\n${resource.mapUrl || ""}`
        );

        alert(
          "Resource details copied!"
        );
      }

    } catch (error) {

      console.log(
        "Share cancelled."
      );
    }
  };


  // ==========================================
  // RESOURCE DATA
  // ==========================================

  const title =
    resource.name ||
    resource.title ||
    "Resource";


  const address =
    resource.address ||
    resource.location ||
    "Address not available";


  const phone =
    resource.phone ||
    "Phone number not available";


  const openingHours =
    resource.openingHours ||
    resource.availability ||
    "Opening hours not available";


  const type =
    resource.type ||
    resource.category ||
    "Community Service";


  // ==========================================
  // RETURN CARD
  // ==========================================

  return (

    <article className="resource-card">


      {/* =====================================
          TOP
      ====================================== */}

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
          title="Save resource"
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


      {/* =====================================
          TITLE
      ====================================== */}

      <h3 className="resource-title">

        {title}

      </h3>


      {/* =====================================
          DESCRIPTION
      ====================================== */}

      <p className="resource-description">

        {resource.description ||
          `Nearby ${type} available through SAHAAY.`}

      </p>


      {/* =====================================
          DETAILS
      ====================================== */}

      <div className="resource-details">


        {/* ADDRESS */}

        <div className="resource-detail">

          <MapPin size={18} />

          <span>

            {address}

          </span>

        </div>


        {/* PHONE */}

        <div className="resource-detail">

          <Phone size={18} />

          <span>

            {phone}

          </span>

        </div>


        {/* OPENING HOURS */}

        <div className="resource-detail">

          <Clock size={18} />

          <span>

            {openingHours}

          </span>

        </div>


        {/* RATING */}

        {resource.rating && (

          <div className="resource-detail">

            <Star
              size={18}
              fill="currentColor"
            />

            <span>

              {resource.rating}

              {resource.reviewCount
                ? ` (${resource.reviewCount} reviews)`
                : ""}

            </span>

          </div>

        )}


        {/* WEBSITE */}

        {resource.website && (

          <div className="resource-detail">

            <Globe size={18} />

            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
            >

              Visit Website

            </a>

          </div>

        )}

      </div>


      {/* =====================================
          COST / SOURCE
      ====================================== */}

      <div className="resource-meta">


        <span>

          Cost:{" "}

          <strong>

            {resource.cost ||
              "Contact provider"}

          </strong>

        </span>


        {resource.source && (

          <span>

            Source:{" "}

            <strong>

              {resource.source}

            </strong>

          </span>

        )}

      </div>


      {/* =====================================
          ACTIONS
      ====================================== */}

      <div className="resource-actions">


        {/* DIRECTIONS */}

        <button
          type="button"
          onClick={handleDirections}
        >

          <Navigation size={16} />

          Directions

        </button>


        {/* CALL */}

        <button
          type="button"
          onClick={handleCall}
        >

          <Phone size={16} />

          Call

        </button>


        {/* SHARE */}

        <button
          type="button"
          onClick={handleShare}
        >

          <Share2 size={16} />

          Share

        </button>

      </div>


      {/* =====================================
          LAST UPDATED
      ====================================== */}

      {resource.lastUpdated && (

        <div className="resource-updated">

          Last updated:{" "}

          {resource.lastUpdated}

        </div>

      )}

    </article>

  );
}

export default ResourceCard;