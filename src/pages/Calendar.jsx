import React, { useState, useEffect } from 'react';
import './Calendar.css';
import TestDataGenerator from '../components/TestDataGenerator.jsx';
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [completedTaskHistory, setCompletedTaskHistory] = useState([]);
  const [schedulingMessages, setSchedulingMessages] = useState([]);
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

  const getDayNames = () => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  };

  const getFirstDayOfMonth = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };
  const getDaysInPreviousMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  };

  const handleDayClick = (day) => {
    setSelectedDay(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`);
    setShowTasks(true);
  };
  const getTaskColors = (day) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    if (tasks[dateKey] && tasks[dateKey].length > 0) {
      return tasks[dateKey]
        .sort((a, b) => a.time.localeCompare(b.time))
        .map(task => goals.find(g => g.goal === task.goal)?.color || 'transparent');
    }
    return [];
  };
  
  const closeTasks = () => {
    setShowTasks(false);
    setSelectedDay(null);
    setShowAddTaskForm(false);
  };

  const nextDay = () => {
    const currentSelectedDate = new Date(selectedDay);
    currentSelectedDate.setDate(currentSelectedDate.getDate() + 1);
    setCurrentDate(currentSelectedDate);
    const nextDayString = `${currentSelectedDate.getFullYear()}-${currentSelectedDate.getMonth() + 1}-${currentSelectedDate.getDate()}`;
    setSelectedDay(nextDayString);
  };
  
  const prevDay = () => {
    const currentSelectedDate = new Date(selectedDay);
    currentSelectedDate.setDate(currentSelectedDate.getDate() - 1);
    setCurrentDate(currentSelectedDate);
    const prevDayString = `${currentSelectedDate.getFullYear()}-${currentSelectedDate.getMonth() + 1}-${currentSelectedDate.getDate()}`;
    setSelectedDay(prevDayString);
  };
  
  

  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const nextDate = new Date(prevDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate;
    });
  };
  
  const prevMonth = () => {
    setCurrentDate(prevDate => {
      const prevDateObj = new Date(prevDate);
      prevDateObj.setMonth(prevDateObj.getMonth() - 1);
      return prevDateObj;
    });
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
    const updatedTasks = { ...tasks };
    const task = updatedTasks[day][index];
    task.completed = true;
    setTasks(updatedTasks);
    setCompletedTaskHistory([...completedTaskHistory, { day, index, task }]); 
    const completedTask = tasks[day][index];
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.goal === completedTask.goal ? { ...goal, completedCount: (goal.completedCount || 0) + 1 } : goal))
    );
  };

  const uncheckTask = (day, index) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const task = updatedTasks[day][index];
      task.completed = false;

      
      updatedTasks[day] = updatedTasks[day].filter((_, i) => i !== index);
      updatedTasks[day] = [...(updatedTasks[day] || []), task];

      return updatedTasks;
    });

    
    setTimeout(() => {
      setTasks((prevTasks) => ({...prevTasks}));
    }, 0);

    const completedTask = tasks[day][index];
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.goal === completedTask.goal ? { ...goal, completedCount: Math.max(0, (goal.completedCount || 0) - 1) } : goal))
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

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const hasTasks = (day) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    return tasks[dateKey] && tasks[dateKey].length > 0;
  };

  const sortTasks = (tasksArray) => tasksArray.sort((a, b) => a.time.localeCompare(b.time));

  const handleAddTaskClick = () => {
    setShowAddTaskForm(true);
  };

  const suggestSchedule = () => {
    const suggestedTasks = {};
    const messages = new Set();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    goals.sort((a, b) => a.rank - b.rank);
  
    const goalPatterns = {};
    const totalDays = Object.keys(tasks).length;
  
    const getTaskStats = () => {
      let totalTasks = 0;
      let maxTasks = 0;
      let dayCount = 0;
  
      Object.values(tasks).forEach(dayTasks => {
        const taskCount = dayTasks.length;
        totalTasks += taskCount;
        maxTasks = Math.max(maxTasks, taskCount);
        dayCount++;
      });
  
      const avgTasks = dayCount > 0 ? totalTasks / dayCount : 0;
      return { avgTasks, maxTasks };
    };
  
    const { avgTasks, maxTasks } = getTaskStats();
    const softLimit = Math.min(Math.ceil(avgTasks * 1.5), maxTasks);
  
    Object.entries(tasks).forEach(([day, dayTasks]) => {
      const taskDate = new Date(day);
      const isPassedDate = taskDate < new Date(currentDate.setHours(0, 0, 0, 0));
      const dayOfWeek = taskDate.getDay();
  
      dayTasks.forEach(task => {
        if (!goalPatterns[task.goal]) {
          goalPatterns[task.goal] = {
            daysOfWeek: Array(7).fill(0),
            timeSlots: Array(24).fill(0),
            totalOccurrences: 0,
            frequency: 0,
            completedTasks: 0,
            totalPastTasks: 0
          };
        }
        
        goalPatterns[task.goal].daysOfWeek[dayOfWeek]++;
        const hour = parseInt(task.time.split(':')[0]);
        goalPatterns[task.goal].timeSlots[hour]++;
        goalPatterns[task.goal].totalOccurrences++;
  
        if (isPassedDate) {
          goalPatterns[task.goal].totalPastTasks++;
          if (task.completed) {
            goalPatterns[task.goal].completedTasks++;
          }
        }
      });
    });
  
    Object.keys(goalPatterns).forEach(goal => {
      goalPatterns[goal].frequency = goalPatterns[goal].totalOccurrences / totalDays;
      goalPatterns[goal].completionRatio = goalPatterns[goal].totalPastTasks > 0 
        ? goalPatterns[goal].completedTasks / goalPatterns[goal].totalPastTasks 
        : 0.5;
    });
  
    const selectBestTime = (goal) => {
      if (!goalPatterns[goal] || goalPatterns[goal].totalOccurrences < 5) {
        return null;
      }
      
      const sortedTimeSlots = goalPatterns[goal].timeSlots
        .map((count, hour) => ({ hour, count }))
        .sort((a, b) => b.count - a.count);
    
      const primarySlot = sortedTimeSlots[0];
      const secondarySlot = sortedTimeSlots[1];
    
      if (secondarySlot && secondarySlot.count / primarySlot.count >= 0.4) {
        const randomValue = Math.random();
        if (randomValue < 0.7) {
          return `${primarySlot.hour.toString().padStart(2, '0')}:00`;
        } else {
          return `${secondarySlot.hour.toString().padStart(2, '0')}:00`;
        }
      }
    
      return `${primarySlot.hour.toString().padStart(2, '0')}:00`;
    };
  
    const shouldScheduleOnDay = (goal, dayOfWeek) => {
      if (!goalPatterns[goal] || goalPatterns[goal].totalOccurrences < 5) {
        messages.add(`Not enough data to suggest schedule for "${goal}".`);
        return false;
      }
      
      const frequency = goalPatterns[goal].frequency;
      const dayStrength = goalPatterns[goal].daysOfWeek[dayOfWeek] / goalPatterns[goal].totalOccurrences;
      const completionRatio = goalPatterns[goal].completionRatio;
      
      const baseProbability = frequency * 7;
      const adjustedProbability = baseProbability * dayStrength * (0.5 + completionRatio);
      
      return Math.random() < adjustedProbability;
    };
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
      const dayOfWeek = new Date(dateString).getDay();
      suggestedTasks[dateString] = [];
      
      for (const goal of goals) {
        if (suggestedTasks[dateString].length >= softLimit) break;
        
        if (shouldScheduleOnDay(goal.goal, dayOfWeek)) {
          const selectedTime = selectBestTime(goal.goal);
          if (selectedTime) {
            suggestedTasks[dateString].push({ time: selectedTime, task: `Task for ${goal.goal}`, goal: goal.goal });
          }
        }
      }
    }
  
    setSchedulingMessages(Array.from(messages));
    return suggestedTasks;
  };
  
  
  
  
  
  
  
  
  
  
  
  

  const handleSuggestSchedule = () => {
    const suggested = suggestSchedule();
    setTasks(prevTasks => {
      const mergedTasks = {...prevTasks};
      for (const day in suggested) {
        mergedTasks[day] = mergedTasks[day] ? [...mergedTasks[day], ...suggested[day]] : [...suggested[day]];
      }
      return mergedTasks;
    });
  };

  return (
    <div className="calendar-page">
      <h2 className="calendar-title">
      <button onClick={prevMonth} className="nav-btn">Previous Month</button>
      {`${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`}
      <button onClick={nextMonth} className="nav-btn">Next Month</button>
    </h2>
      <div className="calendar-grid">
        {getDayNames().map((day) => (
          <div key={day} className="calendar-day day-name">
            {day}
          </div>
        ))}
        {Array.from({ length: getFirstDayOfMonth() }).map((_, index) => {
          const prevMonthDay = getDaysInPreviousMonth() - getFirstDayOfMonth() + index + 1;
          return (
            <div key={`prev-${index}`} className="calendar-day prev-month">
              {prevMonthDay}
            </div>
          );
        })}
            {Array.from({ length: daysInMonth }).map((_, day) => {
              const taskColors = getTaskColors(day + 1);
              return (
                <div
                  key={day + 1}
                  className={`calendar-day ${taskColors.length > 0 ? 'calendar-day-with-tasks' : ''}`}
                  onClick={() => handleDayClick(day + 1)}
                >
                  <span className="day-number">{day + 1}</span>
                  <div className="task-color-container">
                  {taskColors.map((color, index) => (
                  <div
                    key={index}
                    className="task-color-block"
                    style={{ backgroundColor: color }}
                  />
                ))}
                  </div>
                </div>
              );
            })}

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
                    <button
                      className="uncheck-btn"
                      onClick={() => uncheckTask(selectedDay, index)}
                    >
                      Uncheck
                    </button>
                    {showDeleteButtons && (
                        <button
                          className="delete-task-btn"
                          onClick={() => deleteTask(selectedDay, index)}
                        >
                          Delete
                        </button>
                      )}
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
      <button onClick={handleSuggestSchedule} className="suggest-schedule-btn">Suggest Schedule</button>
        {schedulingMessages.length > 0 && (
          <div className="scheduling-messages">
            <h4>Scheduling Information:</h4>
            <ul>
              {schedulingMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}
            </div>
          );
        };

export default Calendar;
