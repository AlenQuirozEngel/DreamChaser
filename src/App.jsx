import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './pages/Calendar.jsx';
import Engagement from './pages/Engagement.jsx';
import Account from './pages/Account.jsx';
import Goals from './pages/Goals.jsx';
import Navbar from './components/Navbar.jsx'; // Import Navbar

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Content area */}
        <div className="content">
          <Routes>
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/engagement" element={<Engagement />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/account" element={<Account />} />
            <Route path="/" element={<Calendar />} /> {/* Default Route */}
          </Routes>
        </div>

        {/* Navbar is fixed at the bottom */}
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
