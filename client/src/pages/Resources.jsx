import { useState } from "react";

import {
  Search,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Globe,
  Heart,
  Hospital,
  School,
  GraduationCap,
  BookOpen
} from "lucide-react";

import "./Resources.css";

function Resources() {

  // =====================================================
  // BACKEND URL
  // =====================================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://sahaay-5bo0.onrender.com";


  // =====================================================
  // STATES
  // =====================================================

  const [location, setLocation] = useState("");

  const [category, setCategory] =
    useState("Hospitals");

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [saved, setSaved] =
    useState([]);


  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "Hospitals",
    "Schools",
    "Education",
    "Scholarships"
  ];


  // =====================================================
  // CONVERT FRONTEND CATEGORY
  // TO BACKEND SEARCH TYPE
  // =====================================================

  const getSearchType = () => {

    if (category === "Hospitals") {
      return "hospital";
    }

    if (category === "Schools") {
      return "school";
    }

    if (category === "Education") {
      return "college";
    }

    if (category === "Scholarships") {
      return "scholarship";
    }

    return "hospital";
  };


  // =====================================================
  // CATEGORY ICON
  // =====================================================

  const getCategoryIcon = (item) => {

    if (item === "Hospitals") {
      return <Hospital size={18} />;
    }

    if (item === "Schools") {
      return <School size={18} />;
    }

    if (item === "Education") {
      return <BookOpen size={18} />;
    }

    if (item === "Scholarships") {
      return <GraduationCap size={18} />;
    }

    return <Heart size={18} />;
  };


  // =====================================================
  // SEARCH BACKEND
  // =====================================================

  const handleSearch = async () => {

    if (!location.trim()) {

      setError(
        "Please enter a location such as Kanchipuram."
      );

      return;
    }


    setLoading(true);
    setError("");
    setResults([]);


    try {

      const url =
        `${API_URL}/api/analyze`;


      console.log(
        "SAHAAY API:",
        url
      );


      const response =
        await fetch(
          url,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              problem:
                getSearchType(),

              location:
                location.trim(),

              language:
                "English"

            })
          }
        );


      // =================================================
      // READ SERVER RESPONSE
      // =================================================

      const data =
        await response.json();


      console.log(
        "SAHAAY BACKEND RESPONSE:",
        data
      );


      // =================================================
      // SERVER ERROR
      // =================================================

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Backend request failed"
        );

      }


      // =================================================
      // CHECK RESULTS
      // =================================================

      if (
        !Array.isArray(data.results)
      ) {

        setError(
          "Backend returned an invalid resource list."
        );

        setResults([]);

        return;
      }


      // =================================================
      // SAVE RESULTS
      // =================================================

      setResults(
        data.results
      );


      // =================================================
      // NO RESULTS
      // =================================================

      if (
        data.results.length === 0
      ) {

        setError(
          data.message ||
          `No nearby ${category.toLowerCase()} found.`
        );

      }

    } catch (err) {

      console.error(
        "SAHAAY FRONTEND ERROR:",
        err
      );


      setError(
        "Cannot connect to the backend. Please check your backend URL."
      );

      setResults([]);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SAVE / UNSAVE RESOURCE
  // =====================================================

  const toggleSave = (id) => {

    setSaved((previous) => {

      if (
        previous.includes(id)
      ) {

        return previous.filter(
          (item) =>
            item !== id
        );

      }

      return [
        ...previous,
        id
      ];

    });

  };


  // =====================================================
  // OPEN GOOGLE MAPS
  // =====================================================

  const handleDirections = (resource) => {

    if (resource.mapUrl) {

      window.open(
        resource.mapUrl,
        "_blank"
      );

      return;
    }


    if (
      resource.latitude !== null &&
      resource.latitude !== undefined &&
      resource.longitude !== null &&
      resource.longitude !== undefined
    ) {

      const url =
        `https://www.google.com/maps/search/?api=1&query=${resource.latitude},${resource.longitude}`;

      window.open(
        url,
        "_blank"
      );

      return;
    }


    alert(
      "Location is not available."
    );

  };


  // =====================================================
  // CALL RESOURCE
  // =====================================================

  const handleCall = (resource) => {

    if (
      !resource.phone ||
      resource.phone ===
        "Phone number not available"
    ) {

      alert(
        "Phone number is not available."
      );

      return;
    }


    window.location.href =
      `tel:${resource.phone}`;

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <main
      className="resources-page"
      style={{
        width: "100%",
        minHeight: "100vh"
      }}
    >


      {/* =================================================
          HERO
      ================================================= */}

      <section className="resources-hero">

        <div className="resources-hero-content">

          <span className="resources-label">
            SAHAAY RESOURCES
          </span>

          <h1>
            Find Help Near You
          </h1>

          <p>
            Search for nearby hospitals,
            schools, education centres and
            scholarship resources.
          </p>

        </div>

      </section>


      {/* =================================================
          SEARCH
      ================================================= */}

      <section
        className="resources-search-section"
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          padding: "25px"
        }}
      >

        {/* LOCATION */}

        <div
          className="resources-search-box"
          style={{
            flex: "1",
            minWidth: "250px"
          }}
        >

          <MapPin size={20} />

          <input
            type="text"
            value={location}
            onChange={(event) =>
              setLocation(
                event.target.value
              )
            }
            onKeyDown={(event) => {

              if (
                event.key === "Enter"
              ) {

                handleSearch();

              }

            }}
            placeholder="Enter location e.g. Kanchipuram"
          />

        </div>


        {/* CATEGORY */}

        <div className="category-filter">

          <Search size={18} />

          <select
            value={category}
            onChange={(event) => {

              setCategory(
                event.target.value
              );

              setResults([]);
              setError("");

            }}
          >

            {categories.map(
              (item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

        </div>


        {/* SEARCH BUTTON */}

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="search-button"
        >

          {loading
            ? "Searching..."
            : "Search"}

        </button>

      </section>


      {/* =================================================
          CATEGORY BUTTONS
      ================================================= */}

      <section className="category-buttons">

        {categories.map(
          (item) => (

            <button
              key={item}
              type="button"
              className={
                category === item
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() => {

                setCategory(item);
                setResults([]);
                setError("");

              }}
            >

              {getCategoryIcon(item)}

              <span>
                {item}
              </span>

            </button>

          )
        )}

      </section>


      {/* =================================================
          RESULTS HEADER
      ================================================= */}

      <section
        className="resources-results-header"
        style={{
          padding: "20px 25px"
        }}
      >

        <div>

          <h2>
            Nearby {category}
          </h2>

          <p>
            {results.length}{" "}
            {category.toLowerCase()} found
          </p>

        </div>

      </section>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          style={{
            margin: "20px",
            padding: "18px",
            borderRadius: "10px",
            background: "#ffe5e5",
            color: "#b00020"
          }}
        >

          {error}

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div
          style={{
            textAlign: "center",
            padding: "50px"
          }}
        >

          <h3>
            Searching...
          </h3>

          <p>
            Finding nearby{" "}
            {category.toLowerCase()}{" "}
            in {location}
          </p>

        </div>

      )}


      {/* =================================================
          RESOURCE CARDS
      ================================================= */}

      {!loading &&
        results.length > 0 && (

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "25px",
            padding: "25px",
            width: "100%",
            boxSizing: "border-box"
          }}
        >

          {results.map(
            (resource, index) => (

              <article
                key={
                  resource.id ||
                  index
                }
                style={{
                  background: "#ffffff",
                  color: "#222222",
                  border: "1px solid #dddddd",
                  borderRadius: "18px",
                  padding: "25px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.12)",
                  boxSizing: "border-box",
                  width: "100%"
                }}
              >


                {/* ======================================
                    CARD HEADER
                ====================================== */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: "15px"
                  }}
                >

                  <span
                    style={{
                      background: "#e8f5e9",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}
                  >

                    {category}

                  </span>


                  {/* SAVE */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleSave(
                        resource.id
                      )
                    }
                    style={{
                      border: "none",
                      background:
                        "transparent",
                      cursor: "pointer"
                    }}
                    title="Save resource"
                  >

                    <Heart
                      size={22}
                      fill={
                        saved.includes(
                          resource.id
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />

                  </button>

                </div>


                {/* ======================================
                    RESOURCE NAME
                ====================================== */}

                <h2
                  style={{
                    margin:
                      "0 0 20px 0",
                    fontSize: "22px"
                  }}
                >

                  {resource.name ||
                    "Resource name unavailable"}

                </h2>


                {/* ======================================
                    ADDRESS
                ====================================== */}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "16px"
                  }}
                >

                  <MapPin
                    size={20}
                    style={{
                      flexShrink: 0
                    }}
                  />

                  <div>

                    <strong>
                      Address
                    </strong>

                    <p
                      style={{
                        margin:
                          "5px 0 0 0"
                      }}
                    >

                      {resource.address ||
                        "Address not available"}

                    </p>

                  </div>

                </div>


                {/* ======================================
                    PHONE
                ====================================== */}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "16px"
                  }}
                >

                  <Phone
                    size={20}
                    style={{
                      flexShrink: 0
                    }}
                  />

                  <div>

                    <strong>
                      Phone
                    </strong>

                    <p
                      style={{
                        margin:
                          "5px 0 0 0"
                      }}
                    >

                      {resource.phone ||
                        "Phone number not available"}

                    </p>

                  </div>

                </div>


                {/* ======================================
                    OPENING HOURS
                ====================================== */}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "16px"
                  }}
                >

                  <Clock
                    size={20}
                    style={{
                      flexShrink: 0
                    }}
                  />

                  <div>

                    <strong>
                      Opening Hours
                    </strong>

                    <p
                      style={{
                        margin:
                          "5px 0 0 0"
                      }}
                    >

                      {resource.openingHours ||
                        "Opening hours not available"}

                    </p>

                  </div>

                </div>


                {/* ======================================
                    WEBSITE
                ====================================== */}

                {resource.website && (

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "16px"
                    }}
                  >

                    <Globe
                      size={20}
                    />

                    <div>

                      <strong>
                        Website
                      </strong>

                      <p>

                        <a
                          href={
                            resource.website
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          Visit Website
                        </a>

                      </p>

                    </div>

                  </div>

                )}


                {/* ======================================
                    EMERGENCY
                ====================================== */}

                {resource.emergency && (

                  <div
                    style={{
                      marginBottom:
                        "16px"
                    }}
                  >

                    <strong>
                      Emergency
                    </strong>

                    <p>

                      {resource.emergency}

                    </p>

                  </div>

                )}


                {/* ======================================
                    COORDINATES
                ====================================== */}

                {resource.latitude !== null &&
                  resource.latitude !== undefined &&
                  resource.longitude !== null &&
                  resource.longitude !== undefined && (

                  <p
                    style={{
                      fontSize: "13px",
                      color: "#666"
                    }}
                  >

                    📍 Coordinates:{" "}
                    {resource.latitude},{" "}
                    {resource.longitude}

                  </p>

                )}


                {/* ======================================
                    ACTION BUTTONS
                ====================================== */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    flexWrap: "wrap"
                  }}
                >

                  {/* DIRECTIONS */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDirections(
                        resource
                      )
                    }
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "6px",
                      padding:
                        "10px 15px",
                      border: "none",
                      borderRadius:
                        "8px",
                      cursor:
                        "pointer"
                    }}
                  >

                    <Navigation
                      size={16}
                    />

                    Directions

                  </button>


                  {/* CALL */}

                  <button
                    type="button"
                    onClick={() =>
                      handleCall(
                        resource
                      )
                    }
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "6px",
                      padding:
                        "10px 15px",
                      border: "none",
                      borderRadius:
                        "8px",
                      cursor:
                        "pointer"
                    }}
                  >

                    <Phone
                      size={16}
                    />

                    Call

                  </button>

                </div>

              </article>

            )
          )}

        </section>

      )}


      {/* =================================================
          NO RESULTS
      ================================================= */}

      {!loading &&
        !error &&
        results.length === 0 && (

        <section
          className="resources-empty"
          style={{
            textAlign: "center",
            padding: "60px 20px"
          }}
        >

          <MapPin
            size={45}
          />

          <h3>
            Search for a resource
          </h3>

          <p>
            Enter a location and choose
            a category to find nearby
            resources.
          </p>

        </section>

      )}

    </main>

  );

}


export default Resources;