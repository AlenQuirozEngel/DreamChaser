import React, { useState, useEffect } from 'react';
import './Calendar.css'; // External CSS for styling

const Calendar = () => {
  // Load tasks from localStorage or initialize empty object
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : {};
  });

  const [selectedDay, setSelectedDay] = useState(null); // To track the selected day
  const [showTasks, setShowTasks] = useState(false); // To show/hide the task modal
  const [newTask, setNewTask] = useState({ time: '', task: '', goal: '' }); // For new task input
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  // Save tasks to localStorage whenever the task state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowTasks(true);
  };

  const closeTasks = () => {
    setShowTasks(false);
    setSelectedDay(null);
  };


  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January, 1 = February, etc.
  const [currentYear, setCurrentYear] = useState(2024); // Change as needed


  const nextDay = () => {
    const next = selectedDay < 30 ? selectedDay + 1 : 1; // Move to next day, wrap around if at 30
    setSelectedDay(next);
  };

  const prevDay = () => {
    const prev = selectedDay > 1 ? selectedDay - 1 : 30; // Move to previous day, wrap around if at 1
    setSelectedDay(prev);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { // December
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const prevMonth = () => {
    if (currentMonth === 0) { // January
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  

  // Handle input changes for new tasks
  const handleTaskInput = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // Add the new task to the selected day
  const addTask = () => {
    if (newTask.time && newTask.task) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [selectedDay]: [...(prevTasks[selectedDay] || []), newTask],
      }));
      setNewTask({ time: '', task: '', goal: '' }); // Reset input fields
    }
  };
  const markAsDone = (day, index) => {
    const updatedTasks = { ...tasks };
    const completedTask = updatedTasks[day][index]; // Get the completed task
    updatedTasks[day].splice(index, 1); // Remove the task at the specified index
    setTasks(updatedTasks); // Update the state
  
    // Update the completed task count for the goal if it exists
    const goalIndex = goals.findIndex(g => g.goal === completedTask.goal);
    if (goalIndex !== -1) {
      const updatedGoals = [...goals];
      updatedGoals[goalIndex].completedCount = (updatedGoals[goalIndex].completedCount || 0) + 1; // Increment completed count
      setGoals(updatedGoals); // Update goals state
      localStorage.setItem('goals', JSON.stringify(updatedGoals)); // Save updated goals to localStorage
    }
  };
  
  const getMonthName = (monthIndex) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  };
  

  const formatDate = (day) => `October ${day}, 2024`;

  return (
    <div className="calendar-page">
      <h2 className="calendar-title"><button onClick={prevMonth} className="nav-btn">Previous Month</button>{`${getMonthName(currentMonth)} ${currentYear}`}<button onClick={nextMonth} className="nav-btn">Next Month</button></h2>
      <div className="calendar-grid">

      {Array.from({ length: daysInMonth }).map((_, day) => (
        <div
          key={day + 1}
          className="calendar-day"
          onClick={() => handleDayClick(day + 1)}
        >
          {day + 1}
        </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTasks && (
        <div className="task-modal">

          <div className="task-content">
            {/* Day Navigation */}
            <div className="day-nav">
              <button onClick={prevDay} className="nav-btn">Previous</button>
              <span className="current-date">{formatDate(selectedDay)}</span>
              <button onClick={nextDay} className="nav-btn">Next</button>
            </div>

            {/* Task List */}
            <div className="task-list-container">
              <ul className="task-list">
                {tasks[selectedDay] && tasks[selectedDay].length > 0 ? (
                  tasks[selectedDay].map((taskItem, index) => {
                    const goal = goals.find(g => g.goal === taskItem.goal);
                    return (
                      <li
                        key={index}
                        className="task-item"
                        style={{ backgroundColor: goal ? goal.color : 'transparent' }} // Use goal's color if available
                      >
                        <span className="task-time">{taskItem.time}</span>
                        <span className="task-name">
                          {taskItem.task} {taskItem.goal && `(Goal: ${taskItem.goal})`}
                        </span>
                        <button 
                          className="done-btn" 
                          onClick={() => markAsDone(selectedDay, index)}
                          >
                          Mark as Done
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className="task-item no-task">No tasks for this day.</li>
                )}
              </ul>
            </div>

            {/* Form to Add New Task */}
            <div className="add-task-form">
              <input
                type="time"
                name="time"
                value={newTask.time}
                onChange={handleTaskInput}
                placeholder="Task Time"
              />
              <input
                type="text"
                name="task"
                value={newTask.task}
                onChange={handleTaskInput}
                placeholder="Task Description"
              />

              {/* Goal Dropdown */}
              <select name="goal" value={newTask.goal} onChange={handleTaskInput}>
                <option value="">No Goal</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.goal}>
                    {goal.goal}
                  </option>
                ))}
              </select>

              <button onClick={addTask} className="add-task-btn">Add Task</button>
            </div>

            <button onClick={closeTasks} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Calendar;
