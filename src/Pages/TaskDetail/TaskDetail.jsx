import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import './TaskDetail.scss';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Edit from '@mui/icons-material/Edit';
import AccessTime from '@mui/icons-material/AccessTime';
import AttachMoney from '@mui/icons-material/AttachMoney';
import CalendarToday from '@mui/icons-material/CalendarToday';
import Person from '@mui/icons-material/Person';
import Assignment from '@mui/icons-material/Assignment';
import Comment from '@mui/icons-material/Comment';
import AttachFile from '@mui/icons-material/AttachFile';
import History from '@mui/icons-material/History';
import CheckCircle from '@mui/icons-material/CheckCircle';
import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import TrendingUp from '@mui/icons-material/TrendingUp';
import taskData, { calculateTaskProgress, calculateTaskCost } from '../../data/taskData';

const BackIcon = ArrowBack;
const EditIcon = Edit;
const TimeIcon = AccessTime;
const MoneyIcon = AttachMoney;
const CalendarIcon = CalendarToday;
const PersonIcon = Person;
const AssignmentIcon = Assignment;
const CommentIcon = Comment;
const AttachFileIcon = AttachFile;
const HistoryIcon = History;
const CheckIcon = CheckCircle;
const UncheckIcon = RadioButtonUnchecked;
const PriorityIcon = PriorityHigh;
const TrendIcon = TrendingUp;

const TaskDetail = () => {
  const { taskId } = useParams();
  const task = taskData.find(t => t.id === parseInt(taskId));

  const [activeTab, setActiveTab] = useState('overview'); // overview, comments, activity, files

  if (!task) {
    return (
      <div className="taskDetail">
        <Sidebar />
        <div className="taskDetailContainer">
          <Navbar />
          <div className="not-found">
            <h2>Task not found</h2>
            <Link to="/tasks">Back to Tasks</Link>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#6b7280';
      case 'in-progress': return '#3b82f6';
      case 'in-review': return '#f59e0b';
      case 'done': return '#10b981';
      default: return '#6b7280';
    }
  };

  const isOverdue = () => {
    return new Date(task.dueDate) < new Date() && task.status !== 'done';
  };

  const progress = calculateTaskProgress(task);
  const actualCost = calculateTaskCost(task);
  const budgetVariance = task.budget - actualCost;
  const timeVariance = task.estimatedHours - task.actualHours;

  return (
    <div className="taskDetail">
      <Sidebar />
      <div className="taskDetailContainer">
        <Navbar />

        <div className="task-detail-content">
          {/* Header */}
          <div className="detail-header">
            <div className="header-left">
              <Link to="/tasks" className="back-btn">
                <BackIcon /> Back to Tasks
              </Link>
              <h1>{task.title}</h1>
              <div className="header-badges">
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  <PriorityIcon /> {task.priority} Priority
                </span>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {task.status.replace('-', ' ').toUpperCase()}
                </span>
                {isOverdue() && (
                  <span className="overdue-badge">
                    <TimeIcon /> OVERDUE
                  </span>
                )}
              </div>
            </div>
            <Link to={`/tasks/edit/${task.id}`} className="edit-btn">
              <EditIcon /> Edit Task
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="detail-grid">
            {/* Left Column - Main Info */}
            <div className="detail-main">
              {/* Description */}
              <div className="detail-section">
                <h2>Description</h2>
                <p>{task.description}</p>
              </div>

              {/* Tabs */}
              <div className="detail-tabs">
                <div className="tab-buttons">
                  <button
                    className={activeTab === 'overview' ? 'active' : ''}
                    onClick={() => setActiveTab('overview')}
                  >
                    <AssignmentIcon /> Overview
                  </button>
                  <button
                    className={activeTab === 'comments' ? 'active' : ''}
                    onClick={() => setActiveTab('comments')}
                  >
                    <CommentIcon /> Comments ({task.comments.length})
                  </button>
                  <button
                    className={activeTab === 'activity' ? 'active' : ''}
                    onClick={() => setActiveTab('activity')}
                  >
                    <HistoryIcon /> Activity
                  </button>
                  <button
                    className={activeTab === 'files' ? 'active' : ''}
                    onClick={() => setActiveTab('files')}
                  >
                    <AttachFileIcon /> Files ({task.attachments.length})
                  </button>
                </div>

                <div className="tab-content">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="overview-tab">
                      <div className="subtasks-section">
                        <h3>Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})</h3>
                        <div className="subtasks-list">
                          {task.subtasks.map(subtask => (
                            <div key={subtask.id} className="subtask-item">
                              {subtask.completed ? (
                                <CheckIcon className="check-icon completed" />
                              ) : (
                                <UncheckIcon className="check-icon" />
                              )}
                              <span className={subtask.completed ? 'completed' : ''}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="tags-section">
                        <h3>Tags</h3>
                        <div className="tags-list">
                          {task.tags.map((tag, idx) => (
                            <span key={idx} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>

                      {task.dependencies.length > 0 && (
                        <div className="dependencies-section">
                          <h3>Dependencies</h3>
                          <p>This task depends on:</p>
                          <ul>
                            {task.dependencies.map(depId => {
                              const depTask = taskData.find(t => t.id === depId);
                              return (
                                <li key={depId}>
                                  <Link to={`/tasks/${depId}`}>
                                    {depTask ? depTask.title : `Task #${depId}`}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comments Tab */}
                  {activeTab === 'comments' && (
                    <div className="comments-tab">
                      <div className="comments-list">
                        {task.comments.map(comment => (
                          <div key={comment.id} className="comment-item">
                            <div className="comment-avatar">
                              {comment.author.charAt(0)}
                            </div>
                            <div className="comment-content">
                              <div className="comment-header">
                                <strong>{comment.author}</strong>
                                <span className="comment-date">{comment.date}</span>
                              </div>
                              <p>{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="add-comment">
                        <textarea placeholder="Add a comment..." rows="4"></textarea>
                        <button className="submit-btn">Post Comment</button>
                      </div>
                    </div>
                  )}

                  {/* Activity Tab */}
                  {activeTab === 'activity' && (
                    <div className="activity-tab">
                      <div className="activity-timeline">
                        {task.activityLog.map((activity, idx) => (
                          <div key={idx} className="activity-item">
                            <div className="activity-dot"></div>
                            <div className="activity-content">
                              <p>
                                <strong>{activity.user}</strong> {activity.action}
                              </p>
                              <span className="activity-date">{activity.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files Tab */}
                  {activeTab === 'files' && (
                    <div className="files-tab">
                      <div className="files-list">
                        {task.attachments.map(file => (
                          <div key={file.id} className="file-item">
                            <AttachFileIcon />
                            <div className="file-info">
                              <strong>{file.name}</strong>
                              <span>{file.size}</span>
                            </div>
                            <button className="download-btn">Download</button>
                          </div>
                        ))}
                      </div>
                      <div className="upload-section">
                        <button className="upload-btn">
                          <AttachFileIcon /> Upload File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="detail-sidebar">
              {/* Assignee Card */}
              <div className="sidebar-card">
                <h3><PersonIcon /> Assignee</h3>
                <div className="assignee-info">
                  <div className="assignee-avatar">
                    {task.assigneeName.charAt(0)}
                  </div>
                  <div className="assignee-details">
                    <strong>{task.assigneeName}</strong>
                    <span className="assignee-type">
                      {task.assigneeType === 'team' ? 'Team Member' : 'Intern'}
                    </span>
                    <span className="hourly-rate">${task.assigneeHourlyRate}/hr</span>
                  </div>
                </div>
              </div>

              {/* Dates Card */}
              <div className="sidebar-card">
                <h3><CalendarIcon /> Timeline</h3>
                <div className="dates-info">
                  <div className="date-item">
                    <label>Start Date:</label>
                    <span>{task.startDate}</span>
                  </div>
                  <div className="date-item">
                    <label>Due Date:</label>
                    <span className={isOverdue() ? 'overdue' : ''}>
                      {task.dueDate}
                    </span>
                  </div>
                  <div className="date-item">
                    <label>Duration:</label>
                    <span>
                      {Math.ceil(
                        (new Date(task.dueDate) - new Date(task.startDate)) /
                        (1000 * 60 * 60 * 24)
                      )} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Tracking Card */}
              <div className="sidebar-card">
                <h3><TimeIcon /> Time Tracking</h3>
                <div className="time-info">
                  <div className="time-item">
                    <label>Estimated Hours:</label>
                    <span>{task.estimatedHours}h</span>
                  </div>
                  <div className="time-item">
                    <label>Actual Hours:</label>
                    <span>{task.actualHours}h</span>
                  </div>
                  <div className="time-item">
                    <label>Remaining:</label>
                    <span className={timeVariance < 0 ? 'over-time' : ''}>
                      {Math.abs(timeVariance)}h {timeVariance < 0 ? 'over' : 'left'}
                    </span>
                  </div>
                  <div className="time-progress-bar">
                    <div
                      className="time-progress-fill"
                      style={{
                        width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%`,
                        backgroundColor: timeVariance < 0 ? '#ef4444' : '#3b82f6'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Budget Card */}
              <div className="sidebar-card">
                <h3><MoneyIcon /> Budget & Cost</h3>
                <div className="budget-info">
                  <div className="budget-item">
                    <label>Budget:</label>
                    <span>${task.budget.toLocaleString()}</span>
                  </div>
                  <div className="budget-item">
                    <label>Actual Cost:</label>
                    <span>${actualCost.toLocaleString()}</span>
                  </div>
                  <div className="budget-item">
                    <label>Variance:</label>
                    <span className={budgetVariance < 0 ? 'over-budget' : 'under-budget'}>
                      ${Math.abs(budgetVariance).toLocaleString()}
                      {budgetVariance < 0 ? ' over' : ' under'}
                    </span>
                  </div>
                  <div className="budget-progress-bar">
                    <div
                      className="budget-progress-fill"
                      style={{
                        width: `${Math.min((actualCost / task.budget) * 100, 100)}%`,
                        backgroundColor: budgetVariance < 0 ? '#ef4444' : '#10b981'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <div className="sidebar-card">
                <h3><TrendIcon /> Progress</h3>
                <div className="progress-info">
                  <div className="progress-circle">
                    <svg viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        strokeDasharray={`${progress * 2.827} 282.7`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dy="7"
                        fontSize="20"
                        fontWeight="bold"
                        fill="#333"
                      >
                        {progress}%
                      </text>
                    </svg>
                  </div>
                  <p className="progress-description">
                    {task.subtasks.filter(st => st.completed).length} of {task.subtasks.length} subtasks completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
