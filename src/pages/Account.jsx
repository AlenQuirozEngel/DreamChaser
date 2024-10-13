import React, { useState } from 'react';
import Survey from '../components/Survey'; // Import the Survey component
import './Account.css'; // Import the Account-specific CSS

const Account = () => {
  const [showSurvey, setShowSurvey] = useState(false);

  // Show the survey when button is clicked
  const handleShowSurvey = () => {
    setShowSurvey(true);
  };

  // Callback to hide the survey after submission
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

      {/* Show the survey if the button is clicked */}
      {showSurvey && <Survey onSurveyComplete={handleSurveyComplete} />}
    </div>
  );
};

export default Account;
