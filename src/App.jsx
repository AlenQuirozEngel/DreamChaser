import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './pages/Calendar.jsx';
import Engagement from './pages/Engagement.jsx';
import Account from './pages/Account.jsx';
import Goals from './pages/Goals.jsx';
import EngagementAI from './components/EngagementAI.jsx'; // Import the new component
import Navbar from './components/Navbar.jsx'; // Import Navbar
import Todo from './components/Todo.jsx';


function App() {
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const colorPreference = localStorage.getItem('colorPreference') || '#42A5F5';
    document.documentElement.style.setProperty('--button-color', colorPreference);
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Content area */}
        <div className="content">
          <Routes>
            <Route path="/calendar" element={<Calendar tasks={tasks} goals={goals}/>} />
            <Route path="/engagement" element={<Engagement />} />
            <Route path="/goals" element={<Goals goals={goals}/>} />
            <Route path="/account" element={<Account />} />
            <Route path="/" element={<Calendar tasks={tasks} goals={goals}/>} /> {/* Default Route */}
            <Route path="/engagement-ai" element={<EngagementAI />} /> 
            <Route path="/to-do" element={<Todo />} />
          </Routes>
        </div>

        {/* Navbar is fixed at the bottom */}
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
