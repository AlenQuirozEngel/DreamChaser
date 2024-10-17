import React, { useState, useEffect } from 'react';
import './Goals.css'; // Import the CSS

const Goals = () => {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const [newGoal, setNewGoal] = useState(''); // New goal input
  const [goalColor, setGoalColor] = useState('#ffffff'); // Color for the new goal
  const [goalDeadline, setGoalDeadline] = useState(''); // Deadline for the new goal
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleGoalInput = (e) => {
    setNewGoal(e.target.value);
  };

  const handleColorInput = (e) => {
    setGoalColor(e.target.value);
  };

  const handleDeadlineInput = (e) => {
    setGoalDeadline(e.target.value);
  };

  const addGoal = () => {
    if (newGoal) {
      const newGoals = [
        ...goals,
        { 
          id: goals.length + 1, 
          goal: newGoal, 
          color: goalColor, 
          deadline: goalDeadline, // Keep storing the deadline
          rank: goals.length + 1, 
          completedCount: 0 
        },
      ];
      setGoals(newGoals);
      setNewGoal(''); 
      setGoalColor('#ffffff'); 
      setGoalDeadline(''); 
    }
  };

  const DeleteGoal = (id) => {
    const goalToDelete = goals.find(goal => goal.id === id);
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);

    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      const updatedTasks = Object.entries(parsedTasks).reduce((acc, [day, dayTasks]) => {
        acc[day] = dayTasks.filter(task => task.goal !== goalToDelete.goal);
        if (acc[day].length === 0) {
          delete acc[day];
        }
        return acc;
      }, {});
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('draggedGoalIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    const draggedGoalIndex = e.dataTransfer.getData('draggedGoalIndex');
    if (draggedGoalIndex === '') return;

    const updatedGoals = [...goals];
    const [draggedGoal] = updatedGoals.splice(draggedGoalIndex, 1);
    updatedGoals.splice(dropIndex, 0, draggedGoal);

    updatedGoals.forEach((goal, i) => (goal.rank = i + 1));
    setGoals(updatedGoals);
  };

  const generateTestGoals = () => {
    const testGoals = [
      { goal: 'Music', color: '#FF6347' },
      { goal: 'Piano', color: '#4682B4' },
      { goal: 'Guitar', color: '#32CD32' },
      { goal: 'Intelligent User Interfaces', color: '#FFD700' },
      { goal: 'Project 1', color: '#FF4500' },
      { goal: 'Project 2', color: '#8A2BE2' },
      { goal: 'Reading', color: '#FF69B4' },
      { goal: 'Exercise', color: '#20B2AA' },
      { goal: 'Climbing', color: '#FF8C00' },
      { goal: 'Study AI', color: '#ADFF2F' },
    ];
  
    const generateRandomDeadline = () => {
      const today = new Date();
      const randomDays = Math.floor(Math.random() * 30); // Random days between 0 and 30
      const deadline = new Date(today);
      deadline.setDate(today.getDate() + randomDays);
      return deadline.toISOString().split('T')[0]; // Return as YYYY-MM-DD
    };
  
    const newGoals = testGoals.map((testGoal, index) => ({
      id: goals.length + index + 1, 
      goal: testGoal.goal, 
      color: testGoal.color, 
      deadline: generateRandomDeadline(), // Assign a random deadline
      rank: goals.length + index + 1,
      completedCount: 0,
    }));
  
    setGoals([...goals, ...newGoals]);
  };
  
  
  return (
    <div className="goals-page">
      <h2>Your Goals</h2>
      <button 
        className="toggle-Delete-btn"
        onClick={() => setShowDeleteButtons(!showDeleteButtons)}
      >
        {showDeleteButtons ? 'Cancel Deletion' : 'Delete Goals'}
      </button>
      
      <button onClick={generateTestGoals} className="generate-goals-btn">Generate Test Goals</button>

      {/* Goals List with Drag and Drop */}
      <ul className="goal-list">
        {goals.length > 0 ? (
          goals.map((goalItem, index) => (
            <li
              key={goalItem.id}
              className="goal-item"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
              style={{ backgroundColor: goalItem.color }}
            >
              <span className="goal-rank">{goalItem.rank}.</span>
              <span className="goal-name">{goalItem.goal}</span>
              {/* Removed the deadline display */}
              {showDeleteButtons && (<button onClick={() => DeleteGoal(goalItem.id)} className="Delete-goal-btn">Delete</button>)}
            </li>
          ))
        ) : (
          <li className="no-goals">No goals yet. Add your first goal!</li>
        )}
      </ul>

      {/* Add Goal Form */}
      <div className="add-goal-form">
        <input
          type="text"
          value={newGoal}
          onChange={handleGoalInput}
          placeholder="Enter your goal"
        />
        <input
          type="color"
          value={goalColor}
          onChange={handleColorInput}
        />
        <input
          type="date"
          value={goalDeadline}
          onChange={handleDeadlineInput} 
          placeholder="Optional deadline"
        />
        <button onClick={addGoal} className="add-goal-btn">Add Goal</button>

      </div>
    </div>
  );
};

export default Goals;
