import React, { useState } from 'react';
import './Survey.css'; // Make sure to create and import the CSS for the survey

const Survey = ({ onSurveyComplete }) => {
  const [favoriteGoal, setFavoriteGoal] = useState('study');
  const [hardestGoal, setHardestGoal] = useState('study');
  const [colorPreference, setColorPreference] = useState('#7E57C2');
  const [modePreference, setModePreference] = useState('light');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('surveyCompleted', 'true');
    localStorage.setItem('favoriteGoal', favoriteGoal);
    localStorage.setItem('hardestGoal', hardestGoal);
    localStorage.setItem('colorPreference', colorPreference);
    localStorage.setItem('modePreference', modePreference);

  document.documentElement.style.setProperty('--button-color', colorPreference); // Apply the color immediately


    onSurveyComplete(); // Call the callback to hide the survey
  };

  return (
    <div id="survey-overlay">
      <div id="survey-container">
        <h2>Welcome to Dream Chaser!</h2>
        <p>Please answer these quick questions to get started:</p>
        <form onSubmit={handleSubmit} id="survey-form">
          <label>
            What type of goal is your favorite?
            <select
              value={favoriteGoal}
              onChange={(e) => setFavoriteGoal(e.target.value)}
              required
            >
              <option value="study">Study</option>
              <option value="sport">Sport</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="personal">Personal</option>
            </select>
          </label>
          <label>
            What type of goal is the hardest for you?
            <select
              value={hardestGoal}
              onChange={(e) => setHardestGoal(e.target.value)}
              required
            >
              <option value="study">Study</option>
              <option value="sport">Sport</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="personal">Personal</option>
            </select>
          </label>
          <label>
            Choose your preferred color theme:
            <select
              value={colorPreference}
              onChange={(e) => setColorPreference(e.target.value)}
              required
            >
              <option value="#7E57C2">Muted Purple</option>
              <option value="#5C6BC0">Muted Indigo</option>
              <option value="#42A5F5">Muted Blue</option>
              <option value="#26A69A">Muted Teal</option>
              <option value="#66BB6A">Muted Green</option>
              <option value="#FFCA28">Muted Amber</option>
              <option value="#FF7043">Muted Deep Orange</option>
            </select>
          </label>
          <label>
            Do you prefer dark mode or light mode?
            <select
              value={modePreference}
              onChange={(e) => setModePreference(e.target.value)}
              required
            >
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Survey;
