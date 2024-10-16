import React from 'react';
import StudyTimeGraph from '../components/temp';
import './Account.css'; // Keep this if you want to maintain the styling

const Account = () => {
  return (
    <div className="page-container">
      <h2 className="page-title">Study Time Graph</h2>
      <StudyTimeGraph />
    </div>
  );
};

export default Account;
