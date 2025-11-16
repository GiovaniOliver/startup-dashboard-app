import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './learncenter.scss';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import { courseModules } from '../../data/educationalContent';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const LearnCenter = () => {
  const [progress, setProgress] = useState({});
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const calculateModuleProgress = (moduleId) => {
    const moduleProgress = progress[moduleId] || {};
    const completedLessons = Object.values(moduleProgress).filter(Boolean).length;
    const module = courseModules.find(m => m.id === moduleId);
    return module ? (completedLessons / module.lessons) * 100 : 0;
  };

  const totalProgress = () => {
    let totalLessons = 0;
    let completedLessons = 0;
    courseModules.forEach(module => {
      totalLessons += module.lessons;
      const moduleProgress = progress[module.id] || {};
      completedLessons += Object.values(moduleProgress).filter(Boolean).length;
    });
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const filteredModules = courseModules.filter(module => {
    if (filter === 'all') return true;
    if (filter === 'in-progress') return calculateModuleProgress(module.id) > 0 && calculateModuleProgress(module.id) < 100;
    if (filter === 'completed') return calculateModuleProgress(module.id) === 100;
    if (filter === 'not-started') return calculateModuleProgress(module.id) === 0;
    return true;
  });

  return (
    <div className="learncenter">
      <Sidebar />
      <div className="learncenterContainer">
        <Navbar />
        <div className="learncenterContent">
          <div className="header">
            <div className="headerLeft">
              <h1>
                <SchoolIcon className="titleIcon" />
                Startup Learning Center
              </h1>
              <p>Master the essential skills to build and grow your startup</p>
            </div>
            <div className="headerRight">
              <div className="statsCard">
                <div className="statItem">
                  <EmojiEventsIcon className="statIcon" />
                  <div className="statContent">
                    <h3>{Math.round(totalProgress())}%</h3>
                    <p>Overall Progress</p>
                  </div>
                </div>
                <div className="progressBar">
                  <div
                    className="progressFill"
                    style={{ width: `${totalProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="quickStats">
            <div className="statBox">
              <SchoolIcon className="icon" />
              <div className="statInfo">
                <h2>{courseModules.length}</h2>
                <p>Total Modules</p>
              </div>
            </div>
            <div className="statBox">
              <TrendingUpIcon className="icon" />
              <div className="statInfo">
                <h2>{courseModules.reduce((acc, m) => acc + m.lessons, 0)}</h2>
                <p>Total Lessons</p>
              </div>
            </div>
            <div className="statBox">
              <CheckCircleIcon className="icon completed" />
              <div className="statInfo">
                <h2>{Object.values(progress).reduce((acc, mod) =>
                  acc + Object.values(mod).filter(Boolean).length, 0)}</h2>
                <p>Completed Lessons</p>
              </div>
            </div>
            <div className="statBox">
              <TimerIcon className="icon" />
              <div className="statInfo">
                <h2>{courseModules.reduce((acc, m) =>
                  acc + parseInt(m.duration.split(' ')[0]), 0)}</h2>
                <p>Weeks of Content</p>
              </div>
            </div>
          </div>

          <div className="filterBar">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All Modules
            </button>
            <button
              className={filter === 'in-progress' ? 'active' : ''}
              onClick={() => setFilter('in-progress')}
            >
              In Progress
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button
              className={filter === 'not-started' ? 'active' : ''}
              onClick={() => setFilter('not-started')}
            >
              Not Started
            </button>
          </div>

          <div className="modulesGrid">
            {filteredModules.map(module => {
              const moduleProgress = calculateModuleProgress(module.id);
              const isCompleted = moduleProgress === 100;
              const isInProgress = moduleProgress > 0 && moduleProgress < 100;
              const isLocked = false; // All modules are unlocked for now

              return (
                <div key={module.id} className={`moduleCard ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}>
                  <div className="moduleHeader">
                    <div className="moduleIcon">{module.icon}</div>
                    <div className="moduleBadge">
                      {isCompleted ? (
                        <CheckCircleIcon className="badgeIcon completed" />
                      ) : isInProgress ? (
                        <PlayCircleOutlineIcon className="badgeIcon inProgress" />
                      ) : isLocked ? (
                        <LockIcon className="badgeIcon locked" />
                      ) : null}
                    </div>
                  </div>
                  <div className="moduleBody">
                    <h3>{module.title}</h3>
                    <p className="description">{module.description}</p>
                    <div className="moduleStats">
                      <div className="stat">
                        <TimerIcon className="statIcon" />
                        <span>{module.duration}</span>
                      </div>
                      <div className="stat">
                        <SchoolIcon className="statIcon" />
                        <span>{module.lessons} lessons</span>
                      </div>
                      <div className={`stat difficulty ${module.difficulty.toLowerCase()}`}>
                        <TrendingUpIcon className="statIcon" />
                        <span>{module.difficulty}</span>
                      </div>
                    </div>
                    <div className="objectives">
                      <h4>Learning Objectives:</h4>
                      <ul>
                        {module.objectives.slice(0, 3).map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="moduleProgress">
                      <div className="progressHeader">
                        <span>Progress</span>
                        <span>{Math.round(moduleProgress)}%</span>
                      </div>
                      <div className="progressBar">
                        <div
                          className="progressFill"
                          style={{ width: `${moduleProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="moduleFooter">
                    <Link
                      to={`/learn/module/${module.id}`}
                      className="startButton"
                    >
                      {isCompleted ? 'Review Module' : isInProgress ? 'Continue Learning' : 'Start Module'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="noResults">
              <SchoolIcon className="noResultsIcon" />
              <h3>No modules found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnCenter;
