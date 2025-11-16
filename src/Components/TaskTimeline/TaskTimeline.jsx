import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import './TaskTimeline.scss';
import FilterList from '@mui/icons-material/FilterList';
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import Today from '@mui/icons-material/Today';
import taskData from '../../data/taskData';

const FilterIcon = FilterList;
const ZoomInIcon = ZoomIn;
const ZoomOutIcon = ZoomOut;
const TodayIcon = Today;

const TaskTimeline = () => {
  const [tasks, setTasks] = useState(taskData);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = day, 2 = week, 0.5 = 2 days per cell

  // Get date range from all tasks
  const getDateRange = () => {
    let minDate = new Date();
    let maxDate = new Date();

    tasks.forEach(task => {
      const start = new Date(task.startDate);
      const end = new Date(task.dueDate);

      if (start < minDate) minDate = start;
      if (end > maxDate) maxDate = end;
    });

    // Add buffer days
    minDate.setDate(minDate.getDate() - 3);
    maxDate.setDate(maxDate.getDate() + 3);

    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getDateRange();

  // Calculate number of days
  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

  // Generate date columns
  const generateDateColumns = () => {
    const columns = [];
    const currentDate = new Date(minDate);

    for (let i = 0; i < totalDays; i++) {
      columns.push(new Date(currentDate));
      currentDate.setDate(currentDate.setDate() + 1);
    }

    return columns;
  };

  const dateColumns = generateDateColumns();

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Sort by start date
    filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Calculate task bar position and width
  const getTaskBarStyle = (task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.dueDate);

    const startDay = Math.floor((startDate - minDate) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const cellWidth = 40; // pixels per day
    const left = startDay * cellWidth;
    const width = duration * cellWidth;

    return {
      left: `${left}px`,
      width: `${width}px`
    };
  };

  // Get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#6b7280';
      case 'in-progress': return '#3b82f6';
      case 'in-review': return '#f59e0b';
      case 'done': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Check if task is overdue
  const isOverdue = (task) => {
    return new Date(task.dueDate) < new Date() && task.status !== 'done';
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Get month headers
  const getMonthHeaders = () => {
    const months = [];
    let currentMonth = null;
    let monthStart = 0;

    dateColumns.forEach((date, index) => {
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      if (monthYear !== currentMonth) {
        if (currentMonth !== null) {
          months.push({
            label: currentMonth,
            start: monthStart,
            width: index - monthStart
          });
        }
        currentMonth = monthYear;
        monthStart = index;
      }
    });

    // Add last month
    if (currentMonth !== null) {
      months.push({
        label: currentMonth,
        start: monthStart,
        width: dateColumns.length - monthStart
      });
    }

    return months;
  };

  const monthHeaders = getMonthHeaders();

  return (
    <div className="taskTimeline">
      <Sidebar />
      <div className="taskTimelineContainer">
        <Navbar />

        <div className="timeline-content">
          <div className="timeline-header">
            <h1>Task Timeline</h1>
            <div className="timeline-controls">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="done">Done</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="timeline-legend">
            <div className="legend-item">
              <div className="legend-bar" style={{ backgroundColor: '#6b7280' }}></div>
              <span>To Do</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar" style={{ backgroundColor: '#3b82f6' }}></div>
              <span>In Progress</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar" style={{ backgroundColor: '#f59e0b' }}></div>
              <span>In Review</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar" style={{ backgroundColor: '#10b981' }}></div>
              <span>Done</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar overdue-bar"></div>
              <span>Overdue</span>
            </div>
          </div>

          <div className="gantt-container">
            <div className="gantt-wrapper">
              {/* Task Names Column */}
              <div className="task-names-column">
                <div className="month-header-spacer"></div>
                <div className="date-header-spacer"></div>
                {filteredTasks.map(task => (
                  <div key={task.id} className="task-name-cell">
                    <Link to={`/tasks/${task.id}`} className="task-name-link">
                      <div className="task-name">{task.title}</div>
                      <div className="task-meta">
                        <span className="assignee">{task.assigneeName}</span>
                        <span
                          className="priority-dot"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        ></span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Timeline Chart */}
              <div className="gantt-chart">
                {/* Month Headers */}
                <div className="month-headers">
                  {monthHeaders.map((month, index) => (
                    <div
                      key={index}
                      className="month-header"
                      style={{
                        left: `${month.start * 40}px`,
                        width: `${month.width * 40}px`
                      }}
                    >
                      {month.label}
                    </div>
                  ))}
                </div>

                {/* Date Headers */}
                <div className="date-headers">
                  {dateColumns.map((date, index) => (
                    <div
                      key={index}
                      className={`date-header ${isToday(date) ? 'today' : ''} ${isWeekend(date) ? 'weekend' : ''}`}
                    >
                      <div className="day-name">{date.toLocaleDateString('default', { weekday: 'short' })}</div>
                      <div className="day-number">{date.getDate()}</div>
                    </div>
                  ))}
                </div>

                {/* Task Bars */}
                <div className="task-bars">
                  {filteredTasks.map(task => (
                    <div key={task.id} className="task-row">
                      {/* Grid cells */}
                      {dateColumns.map((date, index) => (
                        <div
                          key={index}
                          className={`grid-cell ${isToday(date) ? 'today' : ''} ${isWeekend(date) ? 'weekend' : ''}`}
                        ></div>
                      ))}

                      {/* Task bar */}
                      <Link to={`/tasks/${task.id}`} className="task-bar-link">
                        <div
                          className={`task-bar ${isOverdue(task) ? 'overdue' : ''}`}
                          style={{
                            ...getTaskBarStyle(task),
                            backgroundColor: getStatusColor(task.status)
                          }}
                        >
                          <span className="task-bar-label">{task.title}</span>
                          <span className="task-bar-duration">
                            {Math.ceil((new Date(task.dueDate) - new Date(task.startDate)) / (1000 * 60 * 60 * 24))}d
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Today indicator line */}
                {(() => {
                  const today = new Date();
                  const todayIndex = dateColumns.findIndex(date => isToday(date));
                  if (todayIndex !== -1) {
                    return (
                      <div
                        className="today-line"
                        style={{ left: `${todayIndex * 40 + 20}px` }}
                      >
                        <div className="today-marker">
                          <TodayIcon />
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTimeline;
