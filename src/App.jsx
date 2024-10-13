import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './pages/Calendar.jsx';
import Engagement from './pages/Engagement.jsx';
import Account from './pages/Account.jsx';
import Goals from './pages/Goals.jsx';
import Navbar from './components/Navbar.jsx'; // Import Navbar
import TestDataGenerator from './TestDataGenerator.jsx'; // Import TestDataGenerator

function App() {
  useEffect(() => {
    // Call generateTestData when the component mounts
    const generateTestData = () => {
      const sampleGoals = [
        { id: 1, goal: 'Climbing', color: '#D32F2F', rank: 1, completedCount: 0 },
        { id: 2, goal: 'Studying', color: '#388E3C', rank: 2, completedCount: 0 },
        { id: 3, goal: 'Photography', color: '#1976D2', rank: 3, completedCount: 0 },
        { id: 4, goal: 'Cooking', color: '#FBC02D', rank: 4, completedCount: 0 },
        { id: 5, goal: 'Meditation', color: '#7B1FA2', rank: 5, completedCount: 0 },
        { id: 6, goal: 'Gardening', color: '#0097A7', rank: 6, completedCount: 0 },
        { id: 7, goal: 'Learning Guitar', color: '#E64A19', rank: 7, completedCount: 0 },
      ];

      const sampleTasks = {};
      for (let month = 1; month <= 12; month++) {
        const daysInMonth = new Date(2024, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const dateKey = `2024-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          sampleTasks[dateKey] = [];
          const numTasks = Math.floor(Math.random() * 3);
          for (let i = 0; i < numTasks; i++) {
            const randomGoal = sampleGoals[Math.floor(Math.random() * sampleGoals.length)];
            const isCompleted = Math.random() < 0.7;
            const hours = Math.floor(Math.random() * 24);
            const minutes = Math.floor(Math.random() * 60);
            const taskTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const task = {
              time: taskTime,
              task: `Work on ${randomGoal.goal.toLowerCase()}`,
              goal: randomGoal.goal,
              completed: isCompleted,
              completedAt: isCompleted ? new Date(2024, month - 1, day, hours, minutes).toISOString() : null,
            };
            sampleTasks[dateKey].push(task);
            if (isCompleted) {
              randomGoal.completedCount++;
            }
          }
        }
      }

      localStorage.setItem('goals', JSON.stringify(sampleGoals));
      localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    };
    generateTestData();
  }, []);

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
