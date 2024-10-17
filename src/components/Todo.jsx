import React, { useState, useEffect } from 'react';
import './Todo.css';

const CircularProgressBar = ({ percentage, color }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
    return (
      <svg width="100" height="100" className="circular-progress">
        <circle
          stroke="#e0e0e0"
          strokeWidth="10"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          stroke={color || "var(--button-color)"}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
      <text x="50" y="50" textAnchor="middle" dy="7" fontSize="20" fill="white">
      {`${percentage}%`}
      </text>
    </svg>
  );
};
const ToDo = () => {
    const [sleepTime, setSleepTime] = useState('');
    const [wakeTime, setWakeTime] = useState('');
    const [productiveTimes, setProductiveTimes] = useState('');
    const [selectedGoal, setSelectedGoal] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [savedPlan, setSavedPlan] = useState(null);
    const [studyTactics, setStudyTactics] = useState('');
    const [goalProgress, setGoalProgress] = useState('');
    const [tasksLeft, setTasksLeft] = useState('');
    const [daysAssigned, setDaysAssigned] = useState('');
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
      const savedGoals = JSON.parse(localStorage.getItem('goals')) || [];
      
      setGoals(savedGoals);
    }, []);
  
    // Filter goals based on search term
    const filteredGoals = goals.filter(goal => 
        goal && goal.goal && goal.goal.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const handleAddGoal = () => {
        if (selectedGoal && goalProgress) {
          const newGoal = {
            name: selectedGoal,
            progress: goalProgress,
            tasksLeft: tasksLeft,
            daysAssigned: daysAssigned,
            deadline: deadline
          };
          setGoals([...goals, newGoal]);
          setSelectedGoal('');
          setGoalProgress('');
          setTasksLeft('');
          setDaysAssigned('');
          setDeadline('');
        }
      };
      const CircularProgressBar = ({ percentage, color }) => {
        const circumference = 2 * Math.PI * 45;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
      
        return (
          <svg width="100" height="100" className="circular-progress">
            <circle
              stroke="#e0e0e0"
              strokeWidth="10"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              stroke={color || "var(--button-color)"}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <text x="50" y="50" textAnchor="middle" dy="7" fontSize="20" fill="white">
              {`${percentage}%`}
            </text>
          </svg>
        );
      };
  

  const handleSave = () => {
    const data = {
      sleepTime,
      wakeTime,
      productiveTimes,
      studyTactics,
      goals,
    };
  
    localStorage.setItem('manualToDoData', JSON.stringify(data));
    setSavedPlan(data);
    setShowForm(false);
  };

  return (
    <div className="todo-container">
      {/* Search Bar */}
      <input 
        type="text"
        placeholder="Search goals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="goal-search-bar"
      />

      {/* Global Info Box */}
      <div className="global-info-box">
        <h3>Global Information</h3>
        <p><strong>Sleep Time:</strong> {sleepTime || 'Not set'}</p>
        <p><strong>Wake Time:</strong> {wakeTime || 'Not set'}</p>
        <p><strong>Productive Times:</strong> {productiveTimes || 'Not set'}</p>
        <p><strong>Goal Focus:</strong> {selectedGoal || 'None'}</p>
      </div>

      {/* Button to toggle the form */}
      {!showForm && (
        <button className="plan-day-btn" onClick={() => setShowForm(true)}>
          Plan Your Goals
        </button>
      )}

      {/* Display saved plan in a tiny box if available */}
      {savedPlan && (
        <div className="saved-plan-box">
          <h3>Your Saved Progress</h3>
          {savedPlan.goals.map((goal, index) => (
                <div key={index} className="goal-info">
                    {goal.progress && (
                    <>
                        <p>{goal.name}</p>
                        <CircularProgressBar 
                        percentage={parseInt(goal.progress) || 0} 
                        color={goal.color}
                        />
                        <p>Tasks Left: {goal.tasksLeft}</p>
                        <p>Days Assigned: {goal.daysAssigned}</p>
                        <p>Deadline: {goal.deadline}</p>
                    </>
                    )}
                </div>
                ))}
            </div>
                )}

            {/* Change box color based on goal selection */}
            <div 
            className="task-box" 
            style={{ 
                backgroundColor: selectedGoal === 'other' ? '#333' : goals.find(goal => goal.goal === selectedGoal)?.color || '#fff'
            }}
            >
            {/* Task input fields */}
            </div>

      {/* Show the form only when the button is clicked */}
      {showForm && (
        <div className="todo-form">
          <section className="todo-section">
            <h3>Sleep Schedule</h3>
            <p>When do you plan to go to sleep and wake up?</p>
            <input
              type="time"
              placeholder="Sleep Time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="todo-input"
            />
            <input
              type="time"
              placeholder="Wake Time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="todo-input"
            />
          </section>

          <section className="todo-section">
            <h3>Productive Times</h3>
            <p>What time are you most productive? (e.g., Morning, Afternoon, Night)</p>
            <input
              type="text"
              placeholder="Enter your productive times"
              value={productiveTimes}
              onChange={(e) => setProductiveTimes(e.target.value)}
              className="todo-input"
            />
          </section>

          <section className="todo-section">
            <h3>Study Tactics</h3>
            <p>How do you plan to study? (e.g., Pomodoro, Focused Sessions)</p>
            <textarea
              placeholder="Describe your study tactics"
              value={studyTactics}
              onChange={(e) => setStudyTactics(e.target.value)}
              className="todo-textarea"
            ></textarea>
          </section>
            <section className="todo-section">
            <h3>Goal Progress</h3>
            <select 
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="goal-dropdown"
            >
              <option value="">Select a goal</option>
              {goals.map((goal, index) => (
                <option key={index} value={goal.goal}>
                  {goal.goal}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Progress (%)"
              value={goalProgress}
              onChange={(e) => setGoalProgress(e.target.value)}
              className="todo-input"
            />
            <button className="add-goal-btn" onClick={handleAddGoal}>
              Add Goal Progress
            </button>
            
          </section>
          <section className="todo-section">
            <h3>Goal Details</h3>
            <input
                type="number"
                placeholder="Tasks Left"
                value={tasksLeft}
                onChange={(e) => setTasksLeft(e.target.value)}
                className="todo-input"
            />
            <input
                type="text"
                placeholder="Days Assigned (e.g., Mon, Wed, Fri)"
                value={daysAssigned}
                onChange={(e) => setDaysAssigned(e.target.value)}
                className="todo-input"
                
            />
            <input
                type="date"
                placeholder="Deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="todo-input"
            />
            </section>

          {goals.map((goal, index) => (
            <div key={index} className="goal-info">
              <p>{goal.name}</p>
              <p>Progress: {goal.progress}%</p>
            </div>
          ))}
          <button className="save-btn" onClick={handleSave}>
            Save To-Do Plan
          </button>
          
        </div>
      )}
    </div>
  );
};

export default ToDo;