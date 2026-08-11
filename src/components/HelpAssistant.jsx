<form
  onSubmit={handleSubmit}
  className="help-form"
>

  <div className="request-box">

    <textarea
      value={problem}
      onChange={(event) =>
        setProblem(event.target.value)
      }
      placeholder="Example: I need a hospital near me..."
      rows="4"
    />

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
        <MicOff size={20} />
      ) : (
        <Mic size={20} />
      )}

      <span>
        {listening ? "Listening..." : "Speak"}
      </span>

    </button>

  </div>


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

        Finding help...
      </>
    ) : (
      <>
        <Search size={18} />

        Find Help
      </>
    )}

  </button>

</form>