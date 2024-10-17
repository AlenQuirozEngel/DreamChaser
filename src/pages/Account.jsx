import React, { useState, useEffect } from 'react';
import Survey from '../components/Survey';
import StudyTimeGraph from '../components/temp';
import './Account.css';

const Account = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const [favoriteGoal, setFavoriteGoal] = useState(localStorage.getItem('favoriteGoal') || 'None');
  const [hardestGoal, setHardestGoal] = useState(localStorage.getItem('hardestGoal') || 'None');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');
    setGoals(goalsData);
  }, []);

  const handleShowSurvey = () => {
    setShowSurvey(true);
  };

  const handleSurveyComplete = () => {
    setShowSurvey(false);
  };

  const handleGoalChange = (e, type) => {
    const value = e.target.value;
    if (type === 'favorite') {
      setFavoriteGoal(value);
      localStorage.setItem('favoriteGoal', value);
    } else {
      setHardestGoal(value);
      localStorage.setItem('hardestGoal', value);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Account</h2>
      <div className="account-content">
        <p>Manage your account settings here.</p>
        <button className="primary-btn">Update Account</button>
        <button className="secondary-btn">Log Out</button>
        <button className="take-survey-btn" onClick={handleShowSurvey}>
          Take Survey
        </button>

        <div className="goal-performance">
          <h3>Favorite Goal:</h3>
          <select value={favoriteGoal} onChange={(e) => handleGoalChange(e, 'favorite')}>
            <option value="None">Select a goal</option>
            {goals.map((goal, index) => (
              <option key={index} value={goal.goal}>{goal.goal}</option>
            ))}
          </select>

          <h3>Hardest Goal:</h3>
          <select value={hardestGoal} onChange={(e) => handleGoalChange(e, 'hardest')}>
            <option value="None">Select a goal</option>
            {goals.map((goal, index) => (
              <option key={index} value={goal.goal}>{goal.goal}</option>
            ))}
          </select>
        </div>
      </div>

      {showSurvey && <Survey onSurveyComplete={handleSurveyComplete} />}

      <h2 className="page-title">Study Time Graph</h2>

    </div>
  );
};

export default Account;