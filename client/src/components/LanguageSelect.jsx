import {
  Globe,
  ArrowRight
} from "lucide-react";

function LanguageSelect({ onSelect }) {

  const languages = [
    {
      name: "English",
      native: "English",
      icon: "🇬🇧"
    },
    {
      name: "Hindi",
      native: "हिन्दी",
      icon: "🇮🇳"
    },
    {
      name: "Urdu",
      native: "اردو",
      icon: "🌙"
    }
  ];

  return (
    <main className="language-page">

      <div className="language-container">

        <div className="language-icon">
          <Globe size={42} />
        </div>

        <h1>Select Your Language</h1>

        <p>
          Choose your preferred language to continue.
        </p>

        <div className="language-list">

          {languages.map((language) => (
            <button
              key={language.name}
              className="language-card"
              onClick={() => onSelect(language.name)}
            >

              <span className="language-flag">
                {language.icon}
              </span>

              <div className="language-text">
                <strong>
                  {language.name}
                </strong>

                <span>
                  {language.native}
                </span>
              </div>

              <ArrowRight size={21} />

            </button>
          ))}

        </div>

      </div>

    </main>
  );
}

export default LanguageSelect;