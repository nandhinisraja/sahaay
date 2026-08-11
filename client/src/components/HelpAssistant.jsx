import { useState } from "react";

import {
  Search,
  MapPin,
  Loader2,
  Mic,
  MicOff
} from "lucide-react";

import ResourceCard from "./ResourceCard";

import "./HelpAssistant.css";


function HelpAssistant({ language = "English" }) {

  // =====================================================
  // STATES
  // =====================================================

  const [problem, setProblem] = useState("");

  const [location, setLocation] = useState("");

  const [results, setResults] = useState([]);

  const [category, setCategory] = useState("");

  const [resourceType, setResourceType] = useState("");

  const [priority, setPriority] = useState("");

  const [loading, setLoading] = useState(false);

  const [searched, setSearched] = useState(false);

  const [listening, setListening] = useState(false);


  // =====================================================
  // VOICE INPUT
  // =====================================================

  const startVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;

    // Set language based on selected language

    if (language === "Hindi") {

      recognition.lang = "hi-IN";

    } else if (language === "Urdu") {

      recognition.lang = "ur-PK";

    } else {

      recognition.lang = "en-IN";

    }


    recognition.onstart = () => {

      setListening(true);

    };


    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript;

      setProblem(transcript);

      setListening(false);

    };


    recognition.onerror = (event) => {

      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);

      alert(
        "Unable to hear your voice. Please try again."
      );

    };


    recognition.onend = () => {

      setListening(false);

    };


    recognition.start();

  };


  // =====================================================
  // ANALYZE REQUEST
  // =====================================================

  const analyzeProblem = async () => {

    if (!problem.trim()) {

      alert(
        "Please tell us what help you need."
      );

      return;

    }


    setLoading(true);

    setSearched(true);

    setResults([]);

    try {

      const response = await fetch(
        "http://localhost:5001/api/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            problem: problem.trim(),

            location: location.trim(),

            language: language

          })

        }
      );


      if (!response.ok) {

        throw new Error(
          `Server returned ${response.status}`
        );

      }


      const data =
        await response.json();


      console.log(
        "SAHAAY API RESPONSE:",
        data
      );


      if (!data.success) {

        alert(
          data.message ||
          "Unable to process your request."
        );

        return;

      }


      // =================================================
      // SET RESPONSE DATA
      // =================================================

      setCategory(
        data.category || "Available Resources"
      );


      setResourceType(
        data.type || "Resources"
      );


      setPriority(
        data.priority || "Normal"
      );


      setResults(
        Array.isArray(data.resources)
          ? data.resources
          : []
      );


    } catch (error) {

      console.error(
        "SAHAAY BACKEND ERROR:",
        error
      );


      alert(
        "Cannot connect to SAHAAY backend.\n\n" +
        "Please make sure Flask is running on port 5001."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FORM SUBMIT
  // =====================================================

  const handleSubmit = (event) => {

    event.preventDefault();

    analyzeProblem();

  };


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {

    setProblem("");

    setLocation("");

    setResults([]);

    setCategory("");

    setResourceType("");

    setPriority("");

    setSearched(false);

  };


  // =====================================================
  // RETURN UI
  // =====================================================

  return (

    <section className="help-assistant">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="assistant-header">

        <h2>
          How can we help you?
        </h2>

        <p>
          Tell SAHAAY what you need.
        </p>

      </div>


      {/* =================================================
          SEARCH FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="help-form"
      >


        {/* =================================================
            PROBLEM TEXTAREA
        ================================================= */}

        <textarea

          value={problem}

          onChange={(event) =>
            setProblem(event.target.value)
          }

          placeholder={
            language === "Hindi"
              ? "उदाहरण: मुझे अपने पास एक अस्पताल चाहिए..."
              : language === "Urdu"
              ? "مثال: مجھے اپنے قریب ایک ہسپتال چاہیے..."
              : "Example: I need a hospital near me..."
          }

          rows={5}

        />


        {/* =================================================
            VOICE BUTTON
        ================================================= */}

        <button
          type="button"
          className={
            listening
              ? "voice-button listening"
              : "voice-button"
          }
          onClick={startVoiceInput}
        >

          {listening ? (

            <MicOff size={18} />

          ) : (

            <Mic size={18} />

          )}

          <span>

            {listening
              ? "Listening..."
              : "Speak"}

          </span>

        </button>


        {/* =================================================
            LOCATION INPUT
        ================================================= */}

        <div className="location-input">

          <MapPin size={20} />

          <input

            type="text"

            value={location}

            onChange={(event) =>
              setLocation(event.target.value)
            }

            placeholder="Enter your city or location"

          />

        </div>


        {/* =================================================
            FIND HELP BUTTON
        ================================================= */}

        <button
          type="submit"
          disabled={loading}
        >

          {loading ? (

            <>

              <Loader2
                size={18}
                className="spin"
              />

              <span>
                Finding help...
              </span>

            </>

          ) : (

            <>

              <Search size={18} />

              <span>
                Find Help
              </span>

            </>

          )}

        </button>


      </form>


      {/* =================================================
          RESULTS
      ================================================= */}

      {searched && !loading && (

        <div className="results-section">


          {/* =================================================
              RESULTS HEADER
          ================================================= */}

          <div className="results-heading">

            <div>

              <h3>
                {category || "Resources"}
              </h3>

              <p>
                {resourceType ||
                  "Available resources near you"}
              </p>

            </div>


            {priority === "High" && (

              <span className="emergency-badge">

                High Priority

              </span>

            )}

          </div>


          {/* =================================================
              NO RESULTS
          ================================================= */}

          {results.length === 0 ? (

            <div className="no-results">

              <h3>
                No resources found
              </h3>

              <p>
                Try another location or describe
                your need differently.
              </p>

            </div>

          ) : (


            /* =================================================
               RESOURCE CARDS
            ================================================= */

            <div className="resource-grid">

              {results.map(
                (resource, index) => (

                  <ResourceCard
                    key={
                      resource.id ||
                      resource.name ||
                      index
                    }
                    resource={resource}
                  />

                )
              )}

            </div>

          )}


          {/* =================================================
              CLEAR SEARCH
          ================================================= */}

          <div className="clear-search-wrapper">

            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
            >

              Search Again

            </button>

          </div>


        </div>

      )}


    </section>

  );

}


export default HelpAssistant;