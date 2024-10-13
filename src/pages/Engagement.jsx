import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

ChartJS.register(...registerables);

const Engagement = () => {
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
      const uniqueGoals = new Set();
      const monthlyData = {};

      for (const date in tasksData) {
        tasksData[date].forEach(task => {
          if (task.completed) {
            uniqueGoals.add(task.goal);
            const [year, month, day] = date.split('-').map(Number);
            if (year === 2024) {
              monthlyData[task.goal] = monthlyData[task.goal] || Array(12).fill(0);
              monthlyData[task.goal][month - 1]++;
            }
          }
        });
      }

      const goalsArray = Array.from(uniqueGoals).map(goal => ({ name: goal }));
      const allGoalsData = Object.values(monthlyData).reduce((acc, curr) => acc.map((x, i) => x + (curr[i] || 0)), new Array(12).fill(0));

      setChartData({
        allGoals: {
          name: 'All Goals',
          data: allGoalsData,
          backgroundColor: '#ccc',
          borderColor: '#ccc',
        },
        individualGoals: Object.entries(monthlyData).map(([goal, data]) => ({
          name: goal,
          data: data,
          backgroundColor: '#ccc',
          borderColor: '#ccc',
        })),
      });
    };

    fetchData();
  }, []);

  const options = {
    scales: {
      x: {
        type: 'category',
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderChart = (goalData, backgroundColor, borderColor, label) => {
    const chartData = {
      labels: options.scales.x.labels,
      datasets: [{
        label: label,
        data: goalData,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      }],
    };

    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      default:
        return <Line data={chartData} options={options} />;
    }
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Engagement Charts</h2>
      <Tabs>
        <TabList>
          <Tab>All</Tab>
          {chartData.individualGoals.map(goal => <Tab key={goal.name}>{goal.name}</Tab>)}
        </TabList>

        <TabPanel>
          <div className="chart-buttons">
            <button className="primary-btn" onClick={() => setChartType('line')}>Line Chart</button>
            <button className="primary-btn" onClick={() => setChartType('bar')}>Bar Chart</button>
            <button className="primary-btn" onClick={() => setChartType('doughnut')}>Doughnut Chart</button>
          </div>
          <div className="chart-container">
            {renderChart(chartData.allGoals.data, chartData.allGoals.backgroundColor, chartData.allGoals.borderColor, chartData.allGoals.name)}
          </div>
        </TabPanel>
        {chartData.individualGoals.map(goal => (
          <TabPanel key={goal.name}>
            <div className="chart-buttons">
              <button className="primary-btn" onClick={() => setChartType('line')}>Line Chart</button>
              <button className="primary-btn" onClick={() => setChartType('bar')}>Bar Chart</button>
              <button className="primary-btn" onClick={() => setChartType('doughnut')}>Doughnut Chart</button>
            </div>
            <div className="chart-container">
              {renderChart(goal.data, goal.backgroundColor, goal.borderColor, goal.name)}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default Engagement;
