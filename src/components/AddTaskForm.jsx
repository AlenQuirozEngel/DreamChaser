import React, { useState } from 'react';
import './AddTaskForm.css';

const AddTaskForm = ({ onClose, addTask, goals, selectedDay }) => {
  const [newTask, setNewTask] = useState({ time: '', task: '', goal: '' });

  const handleTaskInput = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (newTask.time && newTask.task) {
      const taskColor = newTask.goal ? goals.find(g => g.goal === newTask.goal)?.color : 'rgba(128, 128, 128, 0.5)';
      addTask({ ...newTask, color: taskColor }, selectedDay);
      setNewTask({ time: '', task: '', goal: '' });
      onClose(); 
    }
  };

  return (
    <div className="add-task-popup">
      <div className="add-task-popup-content">
        <h2>Add Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="time"
            name="time"
            value={newTask.time}
            onChange={handleTaskInput}
            placeholder="Task Time"
            required
          />
          <input
            type="text"
            name="task"
            value={newTask.task}
            onChange={handleTaskInput}
            placeholder="Task Description"
            required
          />
          <select name="goal" value={newTask.goal} onChange={handleTaskInput}>
            <option value="">No Goal</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.goal}>
                {goal.goal}
              </option>
            ))}
          </select>
          <div className="button-container">
            <button type="button" onClick={handleSubmit}>
              Add Task
            </button>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
