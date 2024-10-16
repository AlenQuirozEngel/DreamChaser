import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const processData = (rawData, goal) => {
  const counters = Array(24).fill().map(() => ({
    augOctCompleted: 0, augOctIncomplete: 0,
    novemberIncomplete: 0
  }));
  
  Object.entries(rawData).forEach(([date, tasks]) => {
    const month = date.split('-')[1];
    tasks.forEach(task => {
      if (task.goal === goal) {
        const hour = parseInt(task.time.split(':')[0]);
        if (['8', '9', '10'].includes(month)) {
          task.completed ? counters[hour].augOctCompleted++ : counters[hour].augOctIncomplete++;
        } else if (month === '11' && !task.completed) {
          counters[hour].novemberIncomplete++;
        }
      }
    });
  });

  return counters;
};

const TaskTimeGraph = () => {
  const [tasks, setTasks] = useState({});
  const [goals, setGoals] = useState([]);
  const [activeGoal, setActiveGoal] = useState('');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    setTasks(storedTasks);

    const uniqueGoals = [...new Set(Object.values(storedTasks).flatMap(dayTasks => dayTasks.map(task => task.goal)))];
    setGoals(uniqueGoals);
    setActiveGoal(uniqueGoals[0] || '');
  }, []);

  useEffect(() => {
    if (chartRef.current && activeGoal) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const data = processData(tasks, activeGoal);

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`),
          datasets: [
            {
              label: 'Completed',
              data: data.map(d => d.augOctCompleted),
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
            },
            {
              label: 'Incomplete',
              data: data.map(d => d.augOctIncomplete),
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
            },
            {
              label: 'AI schedule',
              data: data.map(d => d.novemberIncomplete),
              backgroundColor: 'rgba(255, 206, 86, 0.7)',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: false,
            },
            y: {
              stacked: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [activeGoal, tasks]);

  return (
    <div>
      <div>
        {goals.map(goal => (
          <button key={goal} onClick={() => setActiveGoal(goal)} style={{fontWeight: activeGoal === goal ? 'bold' : 'normal'}}>
            {goal}
          </button>
        ))}
      </div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default TaskTimeGraph;
