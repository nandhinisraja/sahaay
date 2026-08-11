import {
  X,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Bookmark,
  Share2,
  CheckCircle
} from "lucide-react";

function ResourceModal({
  resource,
  saved,
  onSave,
  onShare,
  onClose
}) {

  const openDirections = () => {

    const address =
      `${resource.title}, ${resource.location}`;

    const query =
      encodeURIComponent(address);

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };


  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="resource-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <button
          className="modal-close"
          onClick={onClose}
          title="Close"
        >
          <X />
        </button>


        {/* HEADER */}

        <div className="modal-header">

          <div
            className={
              resource.category === "Healthcare"
                ? "modal-icon healthcare"
                : "modal-icon education"
            }
          >
            {resource.category === "Healthcare"
              ? "❤"
              : "🎓"}
          </div>


          <div>

            <span className="modal-category">
              {resource.category}
            </span>

            <h2>
              {resource.title}
            </h2>

          </div>

        </div>


        {/* BODY */}

        <div className="modal-body">

          <p className="modal-description">
            {resource.description}
          </p>


          <div className="modal-info">

            <div className="modal-info-row">

              <MapPin />

              <div>
                <strong>
                  Location
                </strong>

                <span>
                  {resource.location}
                </span>
              </div>

            </div>


            <div className="modal-info-row">

              <Clock />

              <div>
                <strong>
                  Availability
                </strong>

                <span>
                  {resource.availability}
                </span>
              </div>

            </div>


            <div className="modal-info-row">

              <Phone />

              <div>
                <strong>
                  Phone
                </strong>

                <span>
                  {resource.phone}
                </span>
              </div>

            </div>


            <div className="modal-info-row">

              <CheckCircle />

              <div>
                <strong>
                  Eligibility
                </strong>

                <span>
                  {resource.eligibility}
                </span>
              </div>

            </div>

          </div>


          {/* ACTION BUTTONS */}

          <div className="modal-actions">

            <button
              className="direction-button"
              onClick={openDirections}
            >
              <Navigation size={18} />
              Get Directions
            </button>


            <button
              className={
                saved
                  ? "secondary-button saved"
                  : "secondary-button"
              }
              onClick={() =>
                onSave(resource.id)
              }
            >

              <Bookmark
                size={18}
                fill={
                  saved
                    ? "currentColor"
                    : "none"
                }
              />

              {saved ? "Saved" : "Save"}

            </button>


            <button
              className="secondary-button"
              onClick={() =>
                onShare(resource)
              }
            >
              <Share2 size={18} />
              Share
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ResourceModal;