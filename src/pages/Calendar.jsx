import React, { useState, useEffect } from 'react';
import './Calendar.css';
import TestDataGenerator from 'C:/Users/Vincent Helms/Documents/GitHub/DreamChaser/TestDataGenerator.jsx';
import AddTaskForm from '../components/AddTaskForm';

const Calendar = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : {};
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [showTasks, setShowTasks] = useState(false);
  const [newTask, setNewTask] = useState({ time: '', task: '', goal: '' });
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (selectedDay) {
      const savedTasks = localStorage.getItem('tasks');
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : {};
      setTasks(parsedTasks);
    }
  }, [selectedDay]);

  const handleDayClick = (day) => {
    setSelectedDay(`${currentYear}-${currentMonth + 1}-${day}`);
    setShowTasks(true);
  };

  const closeTasks = () => {
    setShowTasks(false);
    setSelectedDay(null);
    setShowAddTaskForm(false);
  };

  const nextDay = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const nextDay = (parseInt(selectedDay.split('-')[2]) % daysInMonth) + 1;
    const nextDayString = `${currentYear}-${currentMonth + 1}-${nextDay}`;
    setSelectedDay(nextDayString);
  };

  const prevDay = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevDay = (parseInt(selectedDay.split('-')[2]) - 2 + daysInMonth) % daysInMonth + 1;
    const prevDayString = `${currentYear}-${currentMonth + 1}-${prevDay}`;
    setSelectedDay(prevDayString);
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const handleTaskInput = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = (newTask, selectedDay) => { 
    if (newTask.time && newTask.task) {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[selectedDay] = [...(updatedTasks[selectedDay] || []), newTask];
        return updatedTasks;
      });
      setNewTask({ time: '', task: '', goal: '' });
    }
  };

  const markAsDone = (day, index) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[day] = updatedTasks[day].map((task, i) => (i === index ? { ...task, completed: true } : task));
      return updatedTasks;
    });

    const completedTask = tasks[day][index];
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.goal === completedTask.goal ? { ...goal, completedCount: (goal.completedCount || 0) + 1 } : goal))
    );
  };

  const deleteTask = (day, index) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[day] = updatedTasks[day].filter((_, i) => i !== index);
      if (updatedTasks[day].length === 0) {
        delete updatedTasks[day];
      }
      return updatedTasks;
    });
  };

  const getMonthName = (monthIndex) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  };

  const formatDate = (day) => {
    const dateParts = day.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const dayNum = parseInt(dateParts[2]);
    const date = new Date(year, month, dayNum);
    return `${getMonthName(date.getMonth())} ${dayNum}, ${year}`;
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const hasTasks = (day) => {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    return tasks[dateKey] && tasks[dateKey].length > 0;
  };

  const sortTasks = (tasksArray) => tasksArray.sort((a, b) => a.time.localeCompare(b.time));

  const handleAddTaskClick = () => {
    setShowAddTaskForm(true);
  };

  return (
    <div className="calendar-page">
      <h2 className="calendar-title">
        <button onClick={prevMonth} className="nav-btn">Previous Month</button>
        {`${getMonthName(currentMonth)} ${currentYear}`}
        <button onClick={nextMonth} className="nav-btn">Next Month</button>
      </h2>
      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }).map((_, day) => (
          <div
            key={day + 1}
            className={`calendar-day ${hasTasks(day + 1) ? 'calendar-day-with-tasks' : ''}`}
            onClick={() => handleDayClick(day + 1)}
          >
            {day + 1}
          </div>
        ))}
      </div>

      {showTasks && (
        <div className="task-modal">
          <div className="task-content">
            <div className="day-nav">
              <button onClick={prevDay} className="nav-btn">Previous</button>
              <span className="current-date">{formatDate(selectedDay)}</span>
              <button onClick={nextDay} className="nav-btn">Next</button>
            </div>
            <div className="task-list-container">
              <h3>Current Tasks</h3>
              <ul className="task-list">
                {tasks[selectedDay] && tasks[selectedDay].length > 0 ? (
                  sortTasks(tasks[selectedDay].filter(task => !task.completed)).map((taskItem, index) => (
                    <li key={`current-${index}`} className="task-item" style={{ backgroundColor: goals.find(g => g.goal === taskItem.goal)?.color || 'transparent' }}>
                      <span className="task-time">{taskItem.time}</span>
                      <span className="task-name">
                        {taskItem.goal && <div className="task-goal">{taskItem.goal}</div>}
                        <div className="task-description">{taskItem.task}</div>
                      </span>
                      <button
                        className="done-btn"
                        onClick={() => markAsDone(selectedDay, tasks[selectedDay].indexOf(taskItem))}
                      >
                        Done
                      </button>
                      {showDeleteButtons && (
                        <button
                          className="delete-task-btn"
                          onClick={() => deleteTask(selectedDay, tasks[selectedDay].indexOf(taskItem))}
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="task-item no-task">No current tasks for this day.</li>
                )}
              </ul>

              <h3>Completed Tasks</h3>
              <ul className="task-list completed-tasks">
                {tasks[selectedDay] && sortTasks(tasks[selectedDay].filter(task => task.completed)).map((taskItem, index) => (
                  <li key={`completed-${index}`} className="task-item completed" style={{ backgroundColor: goals.find(g => g.goal === taskItem.goal)?.color || 'transparent' }}>
                    <span className="task-time">{taskItem.time}</span>
                    <span className="task-name">
                      {taskItem.goal && <div className="task-goal">{taskItem.goal}</div>}
                      <div className="task-description">{taskItem.task}</div>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={handleAddTaskClick} className="add-task-btn" style={{ marginBottom: '10px' }}>Add Task</button>
            <button
              className="toggle-delete-btn"
              onClick={() => setShowDeleteButtons(!showDeleteButtons)}
            >
              {showDeleteButtons ? 'Cancel Deletion' : 'Delete Tasks'}
            </button>
            <button onClick={closeTasks} className="close-btn">Close</button>
            {showAddTaskForm && <AddTaskForm onClose={() => setShowAddTaskForm(false)} addTask={addTask} newTask={newTask} handleTaskInput={handleTaskInput} goals={goals} selectedDay={selectedDay} />}
          </div>
        </div>
      )}
      <TestDataGenerator setGoals={setGoals} setTasks={setTasks} />
    </div>
  );
};

export default Calendar;
