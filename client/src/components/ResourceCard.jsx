import {
  MapPin,
  Phone,
  Clock,
  Bookmark,
  Share2,
  Navigation
} from "lucide-react";

import "./ResourceCard.css";


function ResourceCard({
  resource,
  saved = false,
  onSave
}) {

  const handleDirections = () => {

    if (!resource.location) {
      return;
    }

    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(resource.location);

    window.open(
      url,
      "_blank"
    );

  };


  const handleCall = () => {

    if (!resource.phone) {
      alert("Phone number not available.");
      return;
    }

    window.location.href =
      `tel:${resource.phone}`;

  };


  const handleShare = async () => {

    const shareData = {

      title:
        resource.title ||
        "SAHAAY Resource",

      text:
        resource.description ||
        "SAHAAY community resource",

      url:
        window.location.href

    };


    try {

      if (navigator.share) {

        await navigator.share(
          shareData
        );

      } else {

        await navigator.clipboard.writeText(
          window.location.href
        );

        alert(
          "Resource link copied!"
        );

      }

    } catch (error) {

      console.log(
        "Share cancelled."
      );

    }

  };


  return (

    <article className="resource-card">


      {/* CATEGORY */}

      <div className="resource-card-top">

        <span className="resource-type">

          {resource.type ||
            resource.category ||
            "Resource"}

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


      {/* TITLE */}

      <h3 className="resource-title">

        {resource.title ||
          resource.name ||
          "Resource"}

      </h3>


      {/* DESCRIPTION */}

      <p className="resource-description">

        {resource.description ||
          "Community support resource available through SAHAAY."}

      </p>


      {/* DETAILS */}

      <div className="resource-details">


        {resource.location && (

          <div className="resource-detail">

            <MapPin size={18} />

            <span>
              {resource.location}
            </span>

          </div>

        )}


        {resource.phone && (

          <div className="resource-detail">

            <Phone size={18} />

            <span>
              {resource.phone}
            </span>

          </div>

        )}


        {resource.availability && (

          <div className="resource-detail">

            <Clock size={18} />

            <span>
              {resource.availability}
            </span>

          </div>

        )}

      </div>


      {/* COST */}

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


      {/* ACTIONS */}

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


      {/* LAST UPDATED */}

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