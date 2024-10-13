import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const Engagement = () => {
  const [chartType, setChartType] = useState('line'); // Default chart type
  const [data, setData] = useState({ labels: [], datasets: [] }); // Chart data state

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    const goals = savedGoals ? JSON.parse(savedGoals) : [];

    // Generate month labels
    const monthLabels = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'
    ];

    // Prepare data for completed tasks
    const monthlyData = new Array(monthLabels.length).fill(0);
    const otherTasksCount = 0; // This would need logic to calculate unassigned tasks

    goals.forEach(goal => {
      const completedCount = goal.completedCount || 0; // Fetch completed tasks count
      monthlyData[0] += completedCount; // Example: add to January for demonstration
    });

    // Prepare the data for the charts
    setData({
      labels: monthLabels,
      datasets: [
        {
          label: 'Completed Tasks',
          data: monthlyData,
          backgroundColor: goals.map(g => g.color), // Use goal colors
          borderColor: goals.map(g => g.color),
          borderWidth: 1,
        },
        {
          label: 'Others', // Bar for tasks that aren't goals
          data: [otherTasksCount], // Adjust as needed to show tasks not tied to goals
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // White color for others
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Function to render the selected chart type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'doughnut':
        return (
          <Doughnut
            data={{
              labels: data.labels,
              datasets: [{
                label: 'Tasks Completion Ratio',
                data: data.datasets[0].data, // Use completed tasks data
                backgroundColor: goals.map(g => g.color),
              }],
            }}
            options={{ maintainAspectRatio: false }}
          />
        );
      default:
        return <Line data={data} options={options} />;
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Engagement Charts</h2>
      <div className="chart-buttons">
        <button className="primary-btn" onClick={() => setChartType('line')}>Line Chart</button>
        <button className="primary-btn" onClick={() => setChartType('bar')}>Bar Chart</button>
        <button className="primary-btn" onClick={() => setChartType('doughnut')}>Doughnut Chart</button>
      </div>
      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
  );
};

export default Engagement;
