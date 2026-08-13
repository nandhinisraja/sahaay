import { useState } from "react";

import {
  MapPin,
  Search,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Phone,
  Navigation,
  Clock
} from "lucide-react";

import ResourceCard from "./ResourceCard";

import "./HelpAssistant.css";

// ============================================================
// BACKEND API
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://sahaay-5bo0.onrender.com";

// ============================================================
// HELP ASSISTANT
// ============================================================

function HelpAssistant() {

  // ==========================================================
  // FORM
  // ==========================================================

  const [location, setLocation] =
    useState("Kanchipuram");

  const [problem, setProblem] =
    useState("Hospitals");

  const [language, setLanguage] =
    useState("English");

  // ==========================================================
  // RESULTS
  // ==========================================================

  const [resources, setResources] =
    useState([]);

  // ==========================================================
  // UI STATES
  // ==========================================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [searched, setSearched] =
    useState(false);

  const [listening, setListening] =
    useState(false);

  const [speaking, setSpeaking] =
    useState(false);

  const [saved, setSaved] =
    useState([]);

  // ==========================================================
  // CATEGORY OPTIONS
  // ==========================================================

  const categories = [
    {
      value: "Hospitals",
      label: "Hospitals"
    },
    {
      value: "Schools",
      label: "Schools"
    },
    {
      value: "Education",
      label: "Education"
    },
    {
      value: "Scholarships",
      label: "Scholarships"
    }
  ];

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  const getDescription = (type) => {

    const value =
      String(type || "").toLowerCase();

    if (value.includes("hospital")) {

      return (
        "Healthcare facility providing medical " +
        "consultation, treatment and patient support."
      );
    }

    if (value.includes("school")) {

      return (
        "Educational institution providing " +
        "schooling and learning opportunities."
      );
    }

    if (value.includes("scholarship")) {

      return (
        "Educational support resource providing " +
        "information about scholarships and financial assistance."
      );
    }

    if (value.includes("education")) {

      return (
        "Educational resource providing " +
        "learning, guidance and student support."
      );
    }

    return (
      "Nearby community support resource " +
      "available through SAHAAY."
    );
  };

  // ==========================================================
  // FIND HELP
  // ==========================================================

  const findHelp = async () => {

    setError("");
    setResources([]);
    setLoading(true);
    setSearched(true);

    try {

      // ------------------------------------------------------
      // CHECK LOCATION
      // ------------------------------------------------------

      if (!location.trim()) {

        throw new Error(
          "Please enter your location."
        );
      }

      // ------------------------------------------------------
      // CHECK API URL
      // ------------------------------------------------------

      console.log(
        "SAHAAY API:",
        API_URL
      );

      // ------------------------------------------------------
      // SEND REQUEST
      // ------------------------------------------------------

      const response = await fetch(
        `${API_URL}/api/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            problem:
              problem.toLowerCase(),

            location:
              location.trim(),

            language:
              language
          })
        }
      );

      // ------------------------------------------------------
      // READ RESPONSE
      // ------------------------------------------------------

      const data =
        await response.json();

      console.log(
        "SAHAAY API RESPONSE:",
        data
      );

      // ------------------------------------------------------
      // BACKEND ERROR
      // ------------------------------------------------------

      if (!response.ok) {

        throw new Error(
          data.message ||
          `Backend returned ${response.status}`
        );
      }

      if (
        data.status === "error"
      ) {

        throw new Error(
          data.message ||
          "Unable to find nearby resources."
        );
      }

      // ------------------------------------------------------
      // GET ACTUAL RESULTS
      // ------------------------------------------------------

      const results =
        Array.isArray(data.results)
          ? data.results
          : [];

      // ------------------------------------------------------
      // CONVERT API DATA
      // INTO RESOURCE CARD DATA
      // ------------------------------------------------------

      const formattedResources =
        results.map(
          (item, index) => {

            return {

              id:
                item.id ??
                `${data.type}-${index}`,

              title:
                item.name ||
                "Resource",

              name:
                item.name ||
                "Resource",

              type:
                data.type ||
                "Resource",

              category:
                data.type ||
                "Resource",

              description:
                getDescription(
                  data.type
                ),

              location:
                item.address ||
                data.location ||
                "Address not available",

              phone:
                item.phone &&
                item.phone !==
                  "Phone number not available"
                  ? item.phone
                  : "",

              availability:
                item.openingHours ||
                "Opening hours not available",

              cost:
                "Contact provider",

              source:
                "OpenStreetMap",

              website:
                item.website || "",

              latitude:
                item.latitude,

              longitude:
                item.longitude,

              mapUrl:
                item.mapUrl || "",

              emergency:
                item.emergency ||
                "Not specified",

              lastUpdated:
                new Date()
                  .toLocaleDateString()
            };
          }
        );

      // ------------------------------------------------------
      // SAVE RESULTS
      // ------------------------------------------------------

      setResources(
        formattedResources
      );

    } catch (err) {

      console.error(
        "SAHAAY FRONTEND ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to find nearby services right now."
      );

    } finally {

      setLoading(false);
    }
  };

  // ==========================================================
  // SAVE RESOURCE
  // ==========================================================

  const toggleSave = (id) => {

    setSaved(
      (previous) => {

        if (
          previous.includes(id)
        ) {

          return previous.filter(
            (savedId) =>
              savedId !== id
          );
        }

        return [
          ...previous,
          id
        ];
      }
    );
  };

  // ==========================================================
  // VOICE SEARCH
  // ==========================================================

  const startVoiceSearch = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Voice search is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    // Stop if already listening
    if (listening) {
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    // --------------------------------------------------------
    // LANGUAGE
    // --------------------------------------------------------

    if (language === "Hindi") {

      recognition.lang = "hi-IN";

    } else if (
      language === "Urdu"
    ) {

      recognition.lang = "ur-IN";

    } else {

      recognition.lang = "en-IN";
    }

    // --------------------------------------------------------
    // START
    // --------------------------------------------------------

    recognition.onstart = () => {

      console.log(
        "Voice recognition started"
      );

      setListening(true);
    };

    // --------------------------------------------------------
    // RESULT
    // --------------------------------------------------------

    recognition.onresult = (
      event
    ) => {

      const spokenText =
        event.results[0][0]
          .transcript;

      console.log(
        "Voice input:",
        spokenText
      );

      setLocation(
        spokenText
      );

      setListening(false);
    };

    // --------------------------------------------------------
    // ERROR
    // --------------------------------------------------------

    recognition.onerror = (
      event
    ) => {

      console.error(
        "Voice recognition error:",
        event.error
      );

      setListening(false);

      if (
        event.error !==
        "no-speech"
      ) {

        alert(
          "Unable to hear your voice. Please try again."
        );
      }
    };

    // --------------------------------------------------------
    // END
    // --------------------------------------------------------

    recognition.onend = () => {

      console.log(
        "Voice recognition ended"
      );

      setListening(false);
    };

    // IMPORTANT:
    // Event handlers are assigned BEFORE start()

    try {

      recognition.start();

    } catch (err) {

      console.error(
        "Could not start microphone:",
        err
      );

      setListening(false);
    }
  };

  // ==========================================================
  // SPEAK RESULTS
  // ==========================================================

  const speakResults = () => {

    if (
      !("speechSynthesis" in window)
    ) {

      alert(
        "Text-to-speech is not supported in this browser."
      );

      return;
    }

    if (
      resources.length === 0
    ) {

      return;
    }

    // Stop currently speaking
    if (speaking) {

      window.speechSynthesis.cancel();

      setSpeaking(false);

      return;
    }

    const first =
      resources[0];

    const text =
      `SAHAAY found ${resources.length} nearby ${problem.toLowerCase()} resources near ${location}. ` +
      `The first resource is ${first.title}. ` +
      `${
        first.location
          ? `It is located at ${first.location}.`
          : ""
      } ` +
      `${
        first.phone
          ? `The phone number is ${first.phone}.`
          : ""
      }`;

    const speech =
      new SpeechSynthesisUtterance(
        text
      );

    if (
      language === "Hindi"
    ) {

      speech.lang = "hi-IN";

    } else if (
      language === "Urdu"
    ) {

      speech.lang = "ur-IN";

    } else {

      speech.lang = "en-IN";
    }

    speech.rate = 0.9;
    speech.pitch = 1;

    speech.onstart = () => {

      setSpeaking(true);
    };

    speech.onend = () => {

      setSpeaking(false);
    };

    speech.onerror = () => {

      setSpeaking(false);
    };

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      speech
    );
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const resetSearch = () => {

    setResources([]);

    setError("");

    setSearched(false);

    if (
      "speechSynthesis" in window
    ) {

      window.speechSynthesis.cancel();

      setSpeaking(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (

    <section className="help-assistant">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="help-header">

        <div className="help-header-icon">

          <MapPin size={26} />

        </div>

        <div>

          <h2>
            Find help near you
          </h2>

          <p>
            Search for nearby hospitals,
            schools, education and
            scholarship resources.
          </p>

        </div>

      </div>

      {/* =====================================================
          SEARCH CARD
      ===================================================== */}

      <div className="help-search-card">

        {/* LOCATION */}

        <div className="input-group">

          <label>
            Location
          </label>

          <div className="input-wrapper">

            <MapPin
              size={20}
              className="input-icon"
            />

            <input
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              placeholder="Enter your location"
            />

            {/* MICROPHONE */}

            <button
              type="button"
              className={
                listening
                  ? "voice-button listening"
                  : "voice-button"
              }
              onClick={
                startVoiceSearch
              }
              title={
                listening
                  ? "Listening..."
                  : "Search by voice"
              }
              aria-label={
                listening
                  ? "Stop listening"
                  : "Search by voice"
              }
            >

              {listening ? (

                <MicOff size={21} />

              ) : (

                <Mic size={21} />

              )}

            </button>

          </div>

          {listening && (

            <div className="voice-status">

              <span className="voice-dot" />

              Listening... Speak your
              location

            </div>

          )}

        </div>

        {/* CATEGORY */}

        <div className="input-group">

          <label>
            What do you need?
          </label>

          <div className="select-wrapper">

            <Search
              size={19}
              className="select-icon"
            />

            <select
              value={problem}
              onChange={(event) =>
                setProblem(
                  event.target.value
                )
              }
            >

              {categories.map(
                (item) => (

                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>

                )
              )}

            </select>

          </div>

        </div>

        {/* LANGUAGE */}

        <div className="input-group">

          <label>
            Language
          </label>

          <div className="select-wrapper">

            <select
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value
                )
              }
            >

              <option value="English">
                English
              </option>

              <option value="Hindi">
                हिन्दी
              </option>

              <option value="Urdu">
                اردو
              </option>

            </select>

          </div>

        </div>

        {/* FIND HELP */}

        <button
          type="button"
          className="find-help-button"
          onClick={findHelp}
          disabled={loading}
        >

          {loading ? (

            <>
              <Loader2
                size={21}
                className="spin"
              />

              Searching nearby
              resources...
            </>

          ) : (

            <>
              <Search size={21} />

              Find Help
            </>

          )}

        </button>

      </div>

      {/* =====================================================
          SEARCH PROCESS
      ===================================================== */}

      {loading && (

        <div className="search-process">

          <div className="process-title">
            Finding resources near you...
          </div>

          <div className="process-step active">

            <span>1</span>

            <div>
              <strong>
                Finding location
              </strong>

              <small>
                Locating {location}
              </small>
            </div>

          </div>

          <div className="process-line" />

          <div className="process-step active">

            <span>2</span>

            <div>
              <strong>
                Searching nearby
              </strong>

              <small>
                Looking for{" "}
                {problem.toLowerCase()}
              </small>
            </div>

          </div>

          <div className="process-line" />

          <div className="process-step active">

            <span>3</span>

            <div>
              <strong>
                Preparing results
              </strong>

              <small>
                Getting resource details
              </small>
            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && !loading && (

        <div className="help-error">

          <AlertCircle size={24} />

          <div>

            <strong>
              Unable to find services
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={findHelp}
            >
              Search Again
            </button>

          </div>

        </div>

      )}

      {/* =====================================================
          RESULTS
      ===================================================== */}

      {!loading &&
        !error &&
        searched &&
        resources.length > 0 && (

          <div className="help-results">

            {/* RESULTS HEADER */}

            <div className="results-header">

              <div>

                <div className="success-label">

                  <CheckCircle2
                    size={19}
                  />

                  Search completed

                </div>

                <h2>

                  {resources.length} nearby{" "}

                  {problem.toLowerCase()}{" "}

                  resources found

                </h2>

                <p>

                  Showing actual resource
                  details near{" "}

                  <strong>
                    {location}
                  </strong>

                </p>

              </div>

              {/* SPEAK BUTTON */}

              <button
                type="button"
                className={
                  speaking
                    ? "speak-button speaking"
                    : "speak-button"
                }
                onClick={
                  speakResults
                }
              >

                {speaking ? (

                  <VolumeX size={20} />

                ) : (

                  <Volume2 size={20} />

                )}

                {speaking
                  ? "Stop Speaking"
                  : "Speak Results"}

              </button>

            </div>

            {/* RESOURCE CARDS */}

            <div className="help-results-grid">

              {resources.map(
                (resource) => (

                  <ResourceCard
                    key={
                      resource.id
                    }

                    resource={
                      resource
                    }

                    saved={
                      saved.includes(
                        resource.id
                      )
                    }

                    onSave={() =>
                      toggleSave(
                        resource.id
                      )
                    }
                  />

                )
              )}

            </div>

          </div>

        )}

      {/* =====================================================
          NO RESULTS
      ===================================================== */}

      {!loading &&
        !error &&
        searched &&
        resources.length === 0 && (

          <div className="no-results">

            <MapPin size={45} />

            <h3>
              No nearby resources found
            </h3>

            <p>
              Try another location or
              choose a different service.
            </p>

            <button
              type="button"
              onClick={resetSearch}
            >
              Search Again
            </button>

          </div>

        )}

    </section>
  );
}

export default HelpAssistant;