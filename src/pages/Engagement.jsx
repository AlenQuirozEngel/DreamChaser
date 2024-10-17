import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import './Engagement.css';

ChartJS.register(...registerables);

const Engagement = () => {
  const [chartData, setChartData] = useState(null);
  const [showEngagementAI, setShowEngagementAI] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
      const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');

      const monthlyCompletionData = {};
      const hourlyCompletionData = Array(24).fill(0);
      const taskDistributionData = {};

      for (const date in tasksData) {
        tasksData[date].forEach(task => {
          if (task.completed) {
            const goalName = task.goal;
            const startHour = parseInt(task.time.split(':')[0]);

            hourlyCompletionData[startHour]++;

            const month = new Date(date).getMonth();
            monthlyCompletionData[goalName] = monthlyCompletionData[goalName] || Array(12).fill(0);
            monthlyCompletionData[goalName][month]++;

            taskDistributionData[goalName] = (taskDistributionData[goalName] || 0) + 1;
          }
        });
      }

      const goalsWithColors = goalsData.map(goal => ({
        ...goal,
        backgroundColor: goal.color,  // Use the goal's color for the background
        borderColor: goal.color,      // Use the goal's color for the border
      }));
      
      

      setChartData({
        lineChartData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: goalsWithColors.map(goal => ({
            label: goal.goal,
            data: monthlyCompletionData[goal.goal] || Array(12).fill(0),
            backgroundColor: goal.backgroundColor,
            borderColor: goal.borderColor,
            fill: false,
          })),
        },
        barChartData: {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          datasets: [{
            label: 'Completed Tasks per Hour',
            data: hourlyCompletionData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
          }],
        },
        donutChartData: {
          labels: Object.keys(taskDistributionData),
          datasets: [{
            data: Object.values(taskDistributionData),
            backgroundColor: goalsWithColors.map(goal => goal.backgroundColor),
            borderColor: goalsWithColors.map(goal => goal.borderColor),
          }],
        },
      });
    };

    fetchData();
  }, []);

  const toggleEngagementAI = () => {
    setShowEngagementAI(!showEngagementAI);
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  const handleNavigateToAI = () => {
    navigate('/engagement-ai');
  };

  const options = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="page-container">
      <div className="engagement-header">
        <h2 className="page-title">Engagement Overview</h2>
        <button className="engagement-ai-btn" onClick={handleNavigateToAI}>
          View Engagement AI
        </button>
      </div>
      <div className="chart-section">
        <h3>Task Completion Rate (Line Graph)</h3>
        <Line data={chartData.lineChartData} options={options} />

        <h3>Task Completion per Hour (Bar Chart)</h3>
        <Bar data={chartData.barChartData} options={options} />

        <h3>Task Distribution by Goal (Donut Chart)</h3>
        <Doughnut data={chartData.donutChartData} />
      </div>

      <button onClick={toggleEngagementAI} className="toggle-ai-btn">
        {showEngagementAI ? 'Hide Engagement AI' : 'Show Engagement AI'}
      </button>

      {showEngagementAI && <EngagementAI />}
    </div>
  );
};

export default Engagement;