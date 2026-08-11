import { useState } from "react";

import Navbar from "./components/Navbar";
import WelcomeScreen from "./components/WelcomeScreen";
import LanguageSelect from "./components/LanguageSelect";
import HelpAssistant from "./components/HelpAssistant";

import "./App.css";

function App() {
  const [screen, setScreen] = useState("welcome");
  const [language, setLanguage] = useState("English");

  const handleStart = () => {
    setScreen("language");
  };

  const handleLanguageSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setScreen("help");
  };

  const goHome = () => {
    setScreen("welcome");
  };

  return (
    <div className="app">

      <Navbar onHome={goHome} />

      {screen === "welcome" && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {screen === "language" && (
        <LanguageSelect onSelect={handleLanguageSelect} />
      )}

      {screen === "help" && (
        <HelpAssistant language={language} />
      )}

    </div>
  );
}

export default App;