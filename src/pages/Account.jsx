import React, { useState } from 'react';
import Survey from '../components/Survey';
import StudyTimeGraph from '../components/temp';
import './Account.css';

const Account = () => {
  const [showSurvey, setShowSurvey] = useState(false);

  const handleShowSurvey = () => {
    setShowSurvey(true);
  };

  const handleSurveyComplete = () => {
    setShowSurvey(false);
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
      </div>

      {showSurvey && <Survey onSurveyComplete={handleSurveyComplete} />}

      <h2 className="page-title">Study Time Graph</h2>
      <StudyTimeGraph />
    </div>
  );
};

export default Account;
