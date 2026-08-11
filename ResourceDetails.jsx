import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Share2,
} from "lucide-react";

function ResourceDetails({ resource, onBack }) {

  const shareResource = async () => {
    const shareText = `
Sahaay Resource

${resource.name}

Category: ${resource.category}

Location: ${resource.location}

${resource.description}

Cost: ${resource.cost || "Contact the organization"}
    `;

    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.name,
          text: shareText,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(shareText);

      alert("Resource details copied!");
    }
  };


  return (
    <div className="details-page">

      {/* BACK BUTTON */}

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        Back to Resources
      </button>


      {/* DETAILS CARD */}

      <div className="details-container">

        {/* CATEGORY */}

        <span className="details-category">
          {resource.category}
        </span>


        {/* TITLE */}

        <h1>
          {resource.name}
        </h1>


        {/* VERIFIED */}

        {resource.verified && (
          <div className="details-verified">
            <CheckCircle size={17} />
            Verified Resource
          </div>
        )}


        {/* INFORMATION */}

        <div className="details-info">

          <p>
            <MapPin size={17} />
            <strong>Location:</strong>{" "}
            {resource.location}
          </p>

          {resource.phone && (
            <p>
              <Phone size={17} />
              <strong>Phone:</strong>{" "}
              {resource.phone}
            </p>
          )}

          {resource.hours && (
            <p>
              <Clock size={17} />
              <strong>Hours:</strong>{" "}
              {resource.hours}
            </p>
          )}

          {resource.cost && (
            <p>
              💰 <strong>Cost:</strong>{" "}
              {resource.cost}
            </p>
          )}

        </div>


        {/* DESCRIPTION */}

        <div className="details-description">

          <h2>
            About this service
          </h2>

          <p>
            {resource.description}
          </p>

        </div>


        {/* ACTION BUTTONS */}

        <div className="details-actions">

          {resource.phone && (
            <a
              href={`tel:${resource.phone}`}
              className="action-button"
            >
              <Phone size={17} />
              Call Now
            </a>
          )}


          <button
            type="button"
            className="action-button"
            onClick={shareResource}
          >
            <Share2 size={17} />
            Share
          </button>

        </div>


        {/* ELIGIBILITY */}

        {resource.eligibility && (
          <div className="eligibility-section">

            <h2>
              Who can use this service?
            </h2>

            <p>
              {resource.eligibility}
            </p>

          </div>
        )}


        {/* DOCUMENTS */}

        {resource.documents && (
          <div className="documents-section">

            <h2>
              Documents Required
            </h2>

            <ul>
              {resource.documents.map(
                (document, index) => (
                  <li key={index}>
                    {document}
                  </li>
                )
              )}
            </ul>

          </div>
        )}

      </div>

    </div>
  );
}

export default ResourceDetails;