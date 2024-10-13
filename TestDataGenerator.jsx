import React from 'react';

const TestDataGenerator = ({ setGoals, setTasks }) => {
  const generateTestData = () => {
    const sampleGoals = [
      { id: 1, goal: 'Climbing', color: '#D32F2F', rank: 1, completedCount: 0 },
      { id: 2, goal: 'Studying', color: '#388E3C', rank: 2, completedCount: 0 },
      { id: 3, goal: 'Photography', color: '#1976D2', rank: 3, completedCount: 0 },
      { id: 4, goal: 'Cooking', color: '#FBC02D', rank: 4, completedCount: 0 },
      { id: 5, goal: 'Meditation', color: '#7B1FA2', rank: 5, completedCount: 0 },
      { id: 6, goal: 'Gardening', color: '#0097A7', rank: 6, completedCount: 0 },
      { id: 7, goal: 'Learning Guitar', color: '#E64A19', rank: 7, completedCount: 0 },
    ];

    const sampleTasks = {};
    const monthlyCompletedTasks = new Array(12).fill(0);

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(2024, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        if (Math.random() > 0.3) {
          const tasksForDay = [];
          const numTasks = Math.floor(Math.random() * 3) + 1;

          for (let i = 0; i < numTasks; i++) {
            const randomGoal = sampleGoals[Math.floor(Math.random() * sampleGoals.length)];
            const isCompleted = Math.random() > 0.5;
            const taskTime = `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
            
            const task = {
              time: taskTime,
              task: `Work on ${randomGoal.goal.toLowerCase()}`,
              goal: randomGoal.goal,
              completed: isCompleted,
              completedAt: isCompleted ? new Date(2024, month, day, ...taskTime.split(':').map(Number)).toISOString() : null
            };

            tasksForDay.push(task);

            if (isCompleted) {
              randomGoal.completedCount++;
              monthlyCompletedTasks[month]++;
            }
          }

          const dateKey = `2024-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          sampleTasks[dateKey] = tasksForDay;
        }
      }
    }

    setGoals(sampleGoals);
    setTasks(sampleTasks);

    localStorage.setItem('goals', JSON.stringify(sampleGoals));
    localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    localStorage.setItem('monthlyCompletedTasks', JSON.stringify(monthlyCompletedTasks));
  };

  return (
    <button onClick={generateTestData} className="generate-test-data-btn">
      Generate Test Data for 2024
    </button>
  );
};

export default TestDataGenerator;
