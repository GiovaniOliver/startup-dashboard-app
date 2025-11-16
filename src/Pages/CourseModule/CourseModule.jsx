import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './coursemodule.scss';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import { courseModules } from '../../data/educationalContent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';

const CourseModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState({});

  const module = courseModules.find(m => m.id === parseInt(moduleId));

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  }, [progress]);

  if (!module) {
    return (
      <div className="coursemodule">
        <Sidebar />
        <div className="coursemoduleContainer">
          <Navbar />
          <div className="errorMessage">
            <h2>Module not found</h2>
            <Link to="/learn">Back to Learning Center</Link>
          </div>
        </div>
      </div>
    );
  }

  const lesson = module.content[currentLesson];
  const isLessonCompleted = progress[moduleId]?.[currentLesson] || false;

  const markAsComplete = () => {
    const newProgress = {
      ...progress,
      [moduleId]: {
        ...progress[moduleId],
        [currentLesson]: true
      }
    };
    setProgress(newProgress);
  };

  const markAsIncomplete = () => {
    const newProgress = {
      ...progress,
      [moduleId]: {
        ...progress[moduleId],
        [currentLesson]: false
      }
    };
    setProgress(newProgress);
  };

  const goToNextLesson = () => {
    if (currentLesson < module.content.length - 1) {
      setCurrentLesson(currentLesson + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      window.scrollTo(0, 0);
    }
  };

  const completedLessons = Object.values(progress[moduleId] || {}).filter(Boolean).length;
  const moduleProgress = (completedLessons / module.lessons) * 100;

  return (
    <div className="coursemodule">
      <Sidebar />
      <div className="coursemoduleContainer">
        <Navbar />
        <div className="coursemoduleContent">
          <div className="courseHeader">
            <Link to="/learn" className="backButton">
              <ArrowBackIcon /> Back to Learning Center
            </Link>
            <div className="moduleInfo">
              <div className="moduleTitle">
                <span className="icon">{module.icon}</span>
                <div>
                  <h1>{module.title}</h1>
                  <p>{module.description}</p>
                </div>
              </div>
              <div className="progressInfo">
                <div className="progressText">
                  {completedLessons} of {module.lessons} lessons completed
                </div>
                <div className="progressBar">
                  <div
                    className="progressFill"
                    style={{ width: `${moduleProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mainContent">
            <div className="lessonSidebar">
              <h3>
                <MenuBookIcon /> Course Outline
              </h3>
              <div className="lessonList">
                {module.content.map((lessonItem, index) => {
                  const completed = progress[moduleId]?.[index] || false;
                  return (
                    <div
                      key={index}
                      className={`lessonItem ${currentLesson === index ? 'active' : ''} ${completed ? 'completed' : ''}`}
                      onClick={() => setCurrentLesson(index)}
                    >
                      <div className="lessonNumber">
                        {completed ? (
                          <CheckCircleIcon className="checkIcon" />
                        ) : (
                          <RadioButtonUncheckedIcon className="uncheckedIcon" />
                        )}
                        <span>Lesson {lessonItem.lessonNumber}</span>
                      </div>
                      <div className="lessonTitle">{lessonItem.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lessonContent">
              <div className="lessonHeader">
                <div className="lessonMeta">
                  <span className="lessonNumber">Lesson {lesson.lessonNumber}</span>
                  <span className="separator">•</span>
                  <span className="lessonModule">{module.title}</span>
                </div>
                <h2>{lesson.title}</h2>
              </div>

              <div className="lessonBody">
                <div className="contentSection">
                  <h3>Overview</h3>
                  <p className="overview">{lesson.content}</p>
                </div>

                <div className="contentSection">
                  <h3>Key Learning Points</h3>
                  <ul className="keyPoints">
                    {lesson.keyPoints.map((point, index) => (
                      <li key={index}>
                        <StarIcon className="pointIcon" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="contentSection resources">
                  <h3>
                    <DownloadIcon /> Resources & Downloads
                  </h3>
                  <div className="resourceList">
                    {lesson.resources.map((resource, index) => (
                      <div key={index} className="resourceItem">
                        <DownloadIcon className="resourceIcon" />
                        <span>{resource}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lessonActions">
                  {isLessonCompleted ? (
                    <button
                      className="completeButton completed"
                      onClick={markAsIncomplete}
                    >
                      <CheckCircleIcon /> Mark as Incomplete
                    </button>
                  ) : (
                    <button
                      className="completeButton"
                      onClick={markAsComplete}
                    >
                      <CheckCircleIcon /> Mark as Complete
                    </button>
                  )}
                </div>
              </div>

              <div className="lessonNavigation">
                <button
                  className="navButton prev"
                  onClick={goToPrevLesson}
                  disabled={currentLesson === 0}
                >
                  <NavigateBeforeIcon /> Previous Lesson
                </button>
                <button
                  className="navButton next"
                  onClick={goToNextLesson}
                  disabled={currentLesson === module.content.length - 1}
                >
                  Next Lesson <NavigateNextIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseModule;
