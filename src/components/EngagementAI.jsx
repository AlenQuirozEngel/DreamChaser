import React, { useState, useEffect } from 'react';
import './EngagementAI.css';

const EngagementAI = ({ currentDate }) => {
  const [sleepSchedule, setSleepSchedule] = useState(null);
  const [studyTactics, setStudyTactics] = useState(null);
  const [nextTaskSuggestion, setNextTaskSuggestion] = useState(null);
  const [goalProgress, setGoalProgress] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalAnalysis, setGoalAnalysis] = useState(null);
  const [productivityPattern, setProductivityPattern] = useState(null);
  const [topProductiveTimes, setTopProductiveTimes] = useState([]);
  const [immediateTaskSuggestion, setImmediateTaskSuggestion] = useState(null);

  useEffect(() => {
    const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');
    setGoals(goalsData);
    if (goalsData.length > 0) {
      setSelectedGoal(goalsData[0].goal);
    }
  }, []);

  const [focusTaskSuggestion, setFocusTaskSuggestion] = useState(null);

  useEffect(() => {
    if (selectedGoal) {
      analyzeSleepSchedule();
      generateStudyTactics();
      suggestFocusTask();
      calculateGoalProgress();
      analyzeGoal();
      setImmediateTaskSuggestion(suggestImmediateTask());
    }
  }, [selectedGoal]);

  useEffect(() => {
    const suggestedTask = suggestFocusTask();
    setFocusTaskSuggestion(suggestedTask);
  }, [selectedGoal]); // or any other dependencies that should trigger a re-calculation

    const analyzeSleepSchedule = () => {
      const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
      let defaultSleepTime = 22; // 10 PM
      let defaultWakeTime = 7;  // 7 AM
      let lateTaskTimes = [];

      Object.values(tasksData).forEach(dayTasks => {
        dayTasks.forEach(task => {
          if (task.completed) {
            const taskHour = parseInt(task.time.split(':')[0]);
            if (taskHour >= defaultSleepTime || taskHour < defaultWakeTime) {
              lateTaskTimes.push(taskHour);
            }
          }
        });
      });

      if (lateTaskTimes.length > 0) {
        const sortedLateTimes = lateTaskTimes.sort((a, b) => b - a);
        const latestFrequentTime = sortedLateTimes[Math.min(1, sortedLateTimes.length - 1)];
      
        if (latestFrequentTime >= defaultSleepTime || latestFrequentTime < defaultWakeTime) {
          defaultSleepTime = (latestFrequentTime + 1) % 24;
          defaultWakeTime = (defaultSleepTime + 9) % 24;
        }
      }

      setSleepSchedule({
        sleepTime: `${defaultSleepTime.toString().padStart(2, '0')}:00`,
        wakeTime: `${defaultWakeTime.toString().padStart(2, '0')}:00`
      });

      analyzeProductivityPattern(tasksData);
    };
  const analyzeProductivityPattern = (tasksData) => {
    let morningTasks = 0;
    let afternoonTasks = 0;
    let nightTasks = 0;
    let totalTasks = 0;
    let taskTimes = [];

    Object.values(tasksData).forEach(dayTasks => {
      dayTasks.forEach(task => {
        if (task.completed) {
          totalTasks++;
          const taskHour = parseInt(task.time.split(':')[0]);
          taskTimes.push(taskHour);

          if (taskHour >= 5 && taskHour < 12) morningTasks++;
          else if (taskHour >= 12 && taskHour < 19) afternoonTasks++;
          else nightTasks++;
        }
      });
    });

    let pattern;
    if (morningTasks > afternoonTasks && morningTasks > nightTasks) {
      pattern = "You're a MORNING PERSON (most tasks completed in the morning)";
    } else if (afternoonTasks > morningTasks && afternoonTasks > nightTasks) {
      pattern = "You're an AFTERNOON PERSON (most tasks completed in the afternoon)";
    } else if (nightTasks > morningTasks && nightTasks > afternoonTasks) {
      pattern = "You're a NIGHT OWL (most tasks completed at night)";
    } else {
      pattern = "Your productivity is evenly distributed throughout the day";
    }

    setProductivityPattern(pattern);

    // Calculate top 3 productive times
    const timeCount = taskTimes.reduce((acc, time) => {
      acc[time] = (acc[time] || 0) + 1;
      return acc;
    }, {});

    const topTimes = Object.entries(timeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([time]) => `${time.padStart(2, '0')}:00`);

    setTopProductiveTimes(topTimes);
  };

  // Function to generate study tactics based on goals and task completion patterns
  const generateStudyTactics = () => {
    const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');
    const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
    const now = new Date();
    const favoriteGoal = localStorage.getItem('favoriteGoal');
    const hardestGoal = localStorage.getItem('hardestGoal');
  
    const incompletionRates = goalsData.map(goal => {
      const pastTasks = Object.values(tasksData).flat().filter(task => 
        task.goal === goal.goal && new Date(task.date) < now
      );
      const incompleteTasks = pastTasks.filter(task => !task.completed);
      return {
        goal: goal.goal,
        rate: pastTasks.length > 0 ? incompleteTasks.length / pastTasks.length : 0
      };
    }).sort((a, b) => b.rate - a.rate);
  
    const tactics = goalsData.map(goal => {
      const incompletionRate = incompletionRates.find(r => r.goal === goal.goal).rate;
      let breakStrategy;
  
      if (goal.goal === hardestGoal && incompletionRates.indexOf(goal.goal) < 2) {
        breakStrategy = '15 minutes break every 45 minutes';
      } else if (incompletionRate > 0.7) {
        breakStrategy = '10 minutes break every 30 minutes';
      } else if (incompletionRate > 0.4) {
        breakStrategy = '5 minutes break every 30 minutes';
      } else if (goal.goal === favoriteGoal) {
        breakStrategy = 'No scheduled breaks, take them as needed';
      } else {
        breakStrategy = '5 minutes break every hour';
      }
  
      let tactic = `For ${goal.goal}: ${breakStrategy}. `;
      
      if (incompletionRate > 0.5) {
        tactic += 'Consider breaking tasks into smaller, manageable subtasks. ';
      }
      if (goal.goal === hardestGoal) {
        tactic += 'Use the Pomodoro Technique to maintain focus. ';
      }
      if (goal.goal === favoriteGoal) {
        tactic += 'Leverage your enthusiasm to tackle challenging aspects. ';
      }
  
      return { goal: goal.goal, tactic };
    });
  
    setStudyTactics(tactics);
  };
  
    // Function to suggest the next task based on deadlines and urgency
    const suggestFocusTask = () => {
      const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');
      const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
      const favoriteGoal = localStorage.getItem('favoriteGoal');
      const hardestGoal = localStorage.getItem('hardestGoal');
      const now = new Date();

      const allTasks = Object.values(tasksData).flat();
      const incompleteTasks = allTasks.filter(task => !task.completed);

      const calculateFollowThroughRate = (goalName) => {
        const goalTasks = allTasks.filter(task => task.goal === goalName);
        const completedGoalTasks = goalTasks.filter(task => task.completed);
        return completedGoalTasks.length / goalTasks.length;
      };

      const taskScores = incompleteTasks.map(task => {
        const goal = goalsData.find(g => g.goal === task.goal);
        const followThroughRate = calculateFollowThroughRate(task.goal);
        let score = 0;

        // Prioritize tasks with closer deadlines
        if (goal && goal.deadline) {
          const daysUntilDeadline = (new Date(goal.deadline) - now) / (1000 * 60 * 60 * 24);
          score += 1000 / (daysUntilDeadline + 1);
        }

        // Prioritize tasks with lower follow-through rates
        score += (1 - followThroughRate) * 500;

        // Adjust score for favorite goal
        if (task.goal === favoriteGoal && followThroughRate >= 0.9) {
          score *= 1.1;
        }

        // Adjust score for hardest goal
        if (task.goal === hardestGoal) {
          score *= 1.2;
        }

        return { task, score };
      });

      // Check for any task with a deadline in the next week
      const urgentTask = taskScores.find(({ task }) => {
        const goal = goalsData.find(g => g.goal === task.goal);
        if (goal && goal.deadline) {
          const daysUntilDeadline = (new Date(goal.deadline) - now) / (1000 * 60 * 60 * 24);
          return daysUntilDeadline <= 7;
        }
        return false;
      });

      if (urgentTask) {
        return urgentTask.task;
      }

          if (taskScores.length === 0) {
            return null; // or a default task object
          }

          // Otherwise, return the task with the highest score
          return taskScores.sort((a, b) => b.score - a.score)[0].task;
    };
  // Function to calculate goal progress based on task completions
  const calculateGoalProgress = () => {
    const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');
    const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
    const now = new Date();
  
    const progress = goalsData.map(goal => {
      const deadline = new Date(goal.deadline);
      const relevantTasks = Object.entries(tasksData)
        .filter(([date]) => new Date(date) <= deadline)
        .flatMap(([, tasks]) => tasks.filter(task => task.goal === goal.goal));
  
      const completedTasks = relevantTasks.filter(task => task.completed);
      const completionPercentage = relevantTasks.length > 0
        ? (completedTasks.length / relevantTasks.length) * 100
        : 0;
  
      return { goal: goal.goal, progress: completionPercentage };
    });
  
    setGoalProgress(progress);
  };

  const analyzeGoal = () => {
    const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
    const today = getCurrentDay();
    today.setHours(0, 0, 0, 0);

    const goalTasks = Object.entries(tasksData).flatMap(([date, tasks]) => 
      tasks.filter(task => task.goal === selectedGoal)
        .map(task => ({ ...task, date }))
    );
    
    const pastTasks = goalTasks.filter(task => new Date(task.date) < today);
    const completedPastTasks = pastTasks.filter(task => task.completed);

    const totalPastTasks = pastTasks.length;
    const completedTasks = completedPastTasks.length;
    const followThroughPercentage = (completedTasks / totalPastTasks) * 100 || 0;

    const tasksByDay = goalTasks.reduce((acc, task) => {
      const day = new Date(task.date).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const sortedDays = Object.entries(tasksByDay)
      .sort(([, a], [, b]) => b - a)
      .map(([day]) => daysOfWeek[day]);

    const mostActiveDay = sortedDays[0] || 'N/A';
    const leastActiveDay = sortedDays[sortedDays.length - 1] || 'N/A';

    const selectedGoalData = goals.find(g => g.goal === selectedGoal);

    const suggestedDays = sortedDays.slice(0, 3);

    setGoalAnalysis({
      followThroughPercentage,
      mostActiveDay,
      leastActiveDay,
      suggestedDays,
      tasksLeft: goalTasks.length - completedTasks,
      color: selectedGoalData?.color || '#ffffff'
    });
  };

  return (
    <div className="engagement-ai">
      <h3>Engagement AI</h3>
      <div className="goal-selector">
        {goals.map((goal, index) => (
          <button
            key={index}
            className={`goal-button ${selectedGoal === goal.goal ? 'active' : ''}`}
            onClick={() => setSelectedGoal(goal.goal)}
          >
            {goal.goal}
          </button>
        ))}
      </div>
      {goalAnalysis && (
        <section className="goal-analysis">
          <h4>Goal Analysis: {selectedGoal}</h4>
          <p>Follow-through rate: {goalAnalysis.followThroughPercentage.toFixed(2)}%</p>
          <p>Most active day: {goalAnalysis.mostActiveDay}</p>
          <p>Least active day: {goalAnalysis.leastActiveDay}</p>
          <p>Suggested work days: {goalAnalysis.suggestedDays.join(', ')}</p>
          <p>Tasks left: {goalAnalysis.tasksLeft}</p>
        </section>
      )}
      {focusTaskSuggestion && (
          <section className="focus-task">
            <h4>Suggested Focus Task</h4>
            <p>We recommend focusing on: "{focusTaskSuggestion.task}" for your "{focusTaskSuggestion.goal}" goal.</p>
          </section>
        )}
      <section className="sleep-schedule">
        <h4>Sleep Schedule Suggestion</h4>
        {sleepSchedule && (
          <p>Based on your task patterns, we suggest sleeping at {sleepSchedule.sleepTime} and waking up at {sleepSchedule.wakeTime}.</p>
        )}
      </section>

      <section className="productivity-pattern">
        <h4>Productivity Pattern</h4>
        {productivityPattern && <p>{productivityPattern}</p>}
        {topProductiveTimes.length > 0 && (
          <p>Your top productive times are: {topProductiveTimes.join(', ')}</p>
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
        {immediateTaskSuggestion ? (
          <>
            <p>Your next task is "{immediateTaskSuggestion.immediate.task}" for your "{immediateTaskSuggestion.immediate.goal}" goal at {immediateTaskSuggestion.immediate.time}.</p>
            {immediateTaskSuggestion.suggestion && (
              <p>{immediateTaskSuggestion.suggestion}</p>
            )}
          </>
        ) : nextTaskSuggestion ? (
          <p>We suggest working on "{nextTaskSuggestion.task}" for your "{nextTaskSuggestion.goal}" goal next.</p>
        ) : (
          <p>No upcoming tasks. Consider adding some tasks to your schedule.</p>
        )}
      </section>

      <section className="goal-progress">
        <h4>Goal Progress</h4>
        {goalProgress && goalProgress.map((goal, index) => (
          <div key={index} className="goal-progress-item">
            <p>{goal.goal}: {goal.progress.toFixed(2)}% completed</p>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ 
                  width: `${goal.progress}%`,
                  backgroundColor: goals.find(g => g.goal === goal.goal)?.color || '#ffffff'
                }}
              ></div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
export default EngagementAI;

const suggestImmediateTask = () => {
  const tasksData = JSON.parse(localStorage.getItem('tasks') || '{}');
  const goalsData = JSON.parse(localStorage.getItem('goals') || '[]');
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todayTasks = tasksData[now.toISOString().split('T')[0]] || [];
  const upcomingTasks = todayTasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

  const nextTask = upcomingTasks.find(task => {
    const taskTime = task.time.split(':').map(Number);
    return (taskTime[0] * 60 + taskTime[1]) > currentTime;
  });

  if (nextTask) {
    const nextTaskTime = nextTask.time.split(':').map(Number);
    const timeDiff = (nextTaskTime[0] * 60 + nextTaskTime[1]) - currentTime;

    if (timeDiff >= 120) {
      const unscheduledGoals = goalsData.filter(goal => !goal.deadline);
      const furthestGoal = goalsData.reduce((prev, current) => 
        (prev.deadline > current.deadline) ? prev : current
      );

      return {
        immediate: nextTask,
        suggestion: unscheduledGoals.length > 0 ? 
          `Consider adding a task for your ${unscheduledGoals[0].goal} goal` :
          `Consider adding a task for your ${furthestGoal.goal} goal`
      };
    }

    return { immediate: nextTask };
  }

  return null;
};

const getCurrentDay = () => {
  return new Date();
};