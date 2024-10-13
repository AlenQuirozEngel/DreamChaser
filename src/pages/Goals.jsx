import React, { useState, useEffect } from 'react';
import './Goals.css'; // Import the CSS

const Goals = () => {
  const [goals, setGoals] = useState(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const [newGoal, setNewGoal] = useState(''); // New goal input
  const [goalColor, setGoalColor] = useState('#ffffff'); // Color for the new goal

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  // Handle goal input
  const handleGoalInput = (e) => {
    setNewGoal(e.target.value);
  };

  // Handle color input
  const handleColorInput = (e) => {
    setGoalColor(e.target.value);
  };

const addGoal = () => {
  if (newGoal) {
    const newGoals = [
      ...goals,
      { id: goals.length + 1, goal: newGoal, color: goalColor, rank: goals.length + 1, completedCount: 0 }, // Initialize completedCount
    ];
    setGoals(newGoals);
    setNewGoal(''); // Clear the input field
    setGoalColor('#ffffff'); // Reset the color picker
  }
};


  // Drag and drop handling
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('draggedGoalIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    const draggedGoalIndex = e.dataTransfer.getData('draggedGoalIndex');
    if (draggedGoalIndex === '') return;

    // Copy the current goals
    const updatedGoals = [...goals];
    const [draggedGoal] = updatedGoals.splice(draggedGoalIndex, 1); // Remove the dragged goal
    updatedGoals.splice(dropIndex, 0, draggedGoal); // Insert the dragged goal at the drop position

    // Update ranks and set new order
    updatedGoals.forEach((goal, i) => (goal.rank = i + 1));
    setGoals(updatedGoals);
  };

  return (
    <div className="goals-page">
      <h2>Your Goals</h2>
      
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
              style={{ backgroundColor: goalItem.color }} // Apply the selected color
            >
              <span className="goal-rank">{goalItem.rank}.</span>
              <span className="goal-name">{goalItem.goal}</span>
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
        <button onClick={addGoal} className="add-goal-btn">Add Goal</button>
      </div>
    </div>
  );
};

export default Goals;
