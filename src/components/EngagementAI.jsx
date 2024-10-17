import React, { useState, useEffect } from 'react';
import './EngagementAI.css';

const EngagementAI = () => {
  const [sleepSchedule, setSleepSchedule] = useState(null);
  const [studyTactics, setStudyTactics] = useState(null);
  const [nextTaskSuggestion, setNextTaskSuggestion] = useState(null);
  const [goalProgress, setGoalProgress] = useState([]); // To store progress for each goal

  useEffect(() => {
    analyzeSleepSchedule();
    generateStudyTactics();
    suggestNextTask();
    calculateGoalProgress();
  }, []);

  // Function to analyze sleep schedules based on task patterns
  const analyzeSleepSchedule = () => {
    const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
    let latestTaskTime = 0;
    let earliestTaskTime = 24;

    Object.values(tasksData).forEach(dayTasks => {
      dayTasks.forEach(task => {
        if (task.completed) {
          const taskHour = parseInt(task.time.split(':')[0]);
          latestTaskTime = Math.max(latestTaskTime, taskHour);
          earliestTaskTime = Math.min(earliestTaskTime, taskHour);
        }
      });
    });

    const suggestedSleepTime = (latestTaskTime + 2) % 24;
    const suggestedWakeTime = (earliestTaskTime - 1 + 24) % 24;

    setSleepSchedule({
      sleepTime: `${suggestedSleepTime}:00`,
      wakeTime: `${suggestedWakeTime}:00`
    });
  };

  // Function to generate study tactics based on goals and task completion patterns
  const generateStudyTactics = () => {
    const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');
    const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');

    const tactics = goalsData.map(goal => {
      const completedTasks = Object.values(tasksData).flat().filter(task => task.goal === goal.goal && task.completed);
      const averageCompletionTime = completedTasks.reduce((sum, task) => sum + (new Date(task.completionTime) - new Date(task.time)), 0) / completedTasks.length;

      let tactic = '';
      if (averageCompletionTime < 30 * 60 * 1000) {
        tactic = 'Use the Pomodoro Technique: 25 minutes of focused work, 5-minute break.';
      } else if (averageCompletionTime < 60 * 60 * 1000) {
        tactic = 'Try the Flowtime Technique: Work until you need a break, then take one.';
      } else {
        tactic = 'Consider breaking this task into smaller subtasks for better focus.';
      }

      return { goal: goal.goal, tactic };
    });

    setStudyTactics(tactics);
  };

  // Function to suggest the next task based on deadlines and urgency
  const suggestNextTask = () => {
    const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');
    const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
    const now = new Date();
    const currentHour = now.getHours();
  
    const incompleteTasks = Object.values(tasksData).flat().filter(task => !task.completed);
  
    const sortedTasks = incompleteTasks.sort((a, b) => {
      const goalA = goalsData.find(g => g.goal === a.goal);
      const goalB = goalsData.find(g => g.goal === b.goal);
  
      // If either goalA or goalB is undefined, we return 0 (no sorting for that pair)
      if (!goalA || !goalB) return 0;
  
      // Ensure deadline is handled even if undefined
      const deadlineA = goalA.deadline ? new Date(goalA.deadline) : Infinity;
      const deadlineB = goalB.deadline ? new Date(goalB.deadline) : Infinity;
  
      // Now, safely access rank and other properties
      const scoreA = (deadlineA - now) - goalA.rank * 1000 - Math.abs(currentHour - parseInt(a.time));
      const scoreB = (deadlineB - now) - goalB.rank * 1000 - Math.abs(currentHour - parseInt(b.time));
  
      return scoreB - scoreA;
    });
  
    setNextTaskSuggestion(sortedTasks[0]);
  };
  
  // Function to calculate goal progress based on task completions
  const calculateGoalProgress = () => {
    const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');
    const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');

    const progress = goalsData.map(goal => {
      const totalTasks = Object.values(tasksData).flat().filter(task => task.goal === goal.goal);
      const completedTasks = totalTasks.filter(task => task.completed);
      const completionPercentage = (completedTasks.length / totalTasks.length) * 100 || 0;

      return { goal: goal.goal, progress: completionPercentage };
    });

    setGoalProgress(progress);
  };

  return (
    <div className="engagement-ai">
      <h3>Engagement AI</h3>

      <section className="sleep-schedule">
        <h4>Sleep Schedule Suggestion</h4>
        {sleepSchedule && (
          <p>Based on your task patterns, we suggest sleeping at {sleepSchedule.sleepTime} and waking up at {sleepSchedule.wakeTime}.</p>
        )}
      </section>

      <section className="study-tactics">
        <h4>Study Tactics</h4>
        {studyTactics && studyTactics.map((tactic, index) => (
          <p key={index}><strong>{tactic.goal}:</strong> {tactic.tactic}</p>
        ))}
      </section>

      <section className="next-task">
        <h4>Next Task Suggestion</h4>
        {nextTaskSuggestion && (
          <p>We suggest working on "{nextTaskSuggestion.task}" for your "{nextTaskSuggestion.goal}" goal next.</p>
        )}
      </section>

      <section className="goal-progress">
        <h4>Goal Progress</h4>
        {goalProgress && goalProgress.map((goal, index) => (
          <div key={index} className="goal-progress-item">
            <p>{goal.goal}: {goal.progress.toFixed(2)}% completed</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${goal.progress}%` }}></div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default EngagementAI;
