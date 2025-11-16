import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import './TaskDashboard.scss';
import {
  ViewKanban as KanbanIcon,
  List as ListIcon,
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Search as SearchIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import taskData, { getTaskStatistics, calculateTaskProgress } from '../../data/taskData';

const TaskDashboard = () => {
  const [viewMode, setViewMode] = useState('kanban'); // kanban, list, calendar
  const [tasks, setTasks] = useState(taskData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const stats = getTaskStatistics();

  // Kanban columns
  const columns = {
    'todo': { title: 'To Do', color: '#6b7280' },
    'in-progress': { title: 'In Progress', color: '#3b82f6' },
    'in-review': { title: 'In Review', color: '#f59e0b' },
    'done': { title: 'Done', color: '#10b981' }
  };

  // Filter and sort tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Handle drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === parseInt(draggableId)) {
        return { ...task, status: destination.droppableId };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  // Get tasks by status for Kanban
  const getTasksByStatus = (status) => {
    return getFilteredTasks().filter(task => task.status === status);
  };

  // Priority badge color
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

  // Render Kanban View
  const renderKanbanView = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {Object.keys(columns).map(columnId => (
          <div key={columnId} className="kanban-column">
            <div className="column-header" style={{ borderTopColor: columns[columnId].color }}>
              <h3>{columns[columnId].title}</h3>
              <span className="task-count">{getTasksByStatus(columnId).length}</span>
            </div>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  {getTasksByStatus(columnId).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                        >
                          <Link to={`/tasks/${task.id}`} className="task-link">
                            <div className="task-header">
                              <h4>{task.title}</h4>
                              <span
                                className="priority-badge"
                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <p className="task-description">{task.description.substring(0, 100)}...</p>
                            <div className="task-meta">
                              <div className="assignee">
                                <div className="avatar">{task.assigneeName.charAt(0)}</div>
                                <span>{task.assigneeName}</span>
                              </div>
                              <div className="task-info">
                                <span className={`due-date ${isOverdue(task) ? 'overdue' : ''}`}>
                                  <TimeIcon /> {task.dueDate}
                                </span>
                              </div>
                            </div>
                            <div className="task-progress">
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{ width: `${calculateTaskProgress(task)}%` }}
                                />
                              </div>
                              <span className="progress-text">{calculateTaskProgress(task)}%</span>
                            </div>
                            <div className="task-tags">
                              {task.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="tag">{tag}</span>
                              ))}
                            </div>
                          </Link>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );

  // Render List View
  const renderListView = () => (
    <div className="list-view">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Assignee</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Progress</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredTasks().map(task => (
            <tr key={task.id} className={isOverdue(task) ? 'overdue-row' : ''}>
              <td>
                <Link to={`/tasks/${task.id}`} className="task-title-link">
                  <strong>{task.title}</strong>
                  <div className="task-tags-small">
                    {task.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="tag-small">{tag}</span>
                    ))}
                  </div>
                </Link>
              </td>
              <td>
                <div className="assignee-cell">
                  <div className="avatar-small">{task.assigneeName.charAt(0)}</div>
                  <span>{task.assigneeName}</span>
                </div>
              </td>
              <td>
                <span
                  className="priority-badge-small"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              </td>
              <td>
                <span className={`status-badge status-${task.status}`}>
                  {columns[task.status]?.title || task.status}
                </span>
              </td>
              <td className={isOverdue(task) ? 'overdue-text' : ''}>
                {task.dueDate}
              </td>
              <td>
                <div className="progress-bar-small">
                  <div
                    className="progress-fill-small"
                    style={{ width: `${calculateTaskProgress(task)}%` }}
                  />
                  <span className="progress-text-small">{calculateTaskProgress(task)}%</span>
                </div>
              </td>
              <td>${(task.actualHours * task.assigneeHourlyRate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render Calendar View
  const renderCalendarView = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const getTasksForDay = (day) => {
      if (!day) return [];
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return getFilteredTasks().filter(task => task.dueDate === dateStr);
    };

    return (
      <div className="calendar-view">
        <div className="calendar-header">
          <h2>{firstDay.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        </div>
        <div className="calendar-grid">
          <div className="calendar-days-header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {days.map((day, index) => {
              const tasksForDay = getTasksForDay(day);
              const isToday = day === currentDate.getDate();
              return (
                <div
                  key={index}
                  className={`calendar-day ${!day ? 'empty' : ''} ${isToday ? 'today' : ''}`}
                >
                  {day && (
                    <>
                      <div className="day-number">{day}</div>
                      <div className="day-tasks">
                        {tasksForDay.slice(0, 3).map(task => (
                          <Link
                            key={task.id}
                            to={`/tasks/${task.id}`}
                            className="calendar-task"
                            style={{ borderLeftColor: getPriorityColor(task.priority) }}
                          >
                            {task.title}
                          </Link>
                        ))}
                        {tasksForDay.length > 3 && (
                          <div className="more-tasks">+{tasksForDay.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="taskDashboard">
      <Sidebar />
      <div className="taskDashboardContainer">
        <Navbar />

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#3b82f6' }}>
              <CheckIcon />
            </div>
            <div className="stat-info">
              <h3>{stats.done}/{stats.total}</h3>
              <p>Tasks Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
              <TimeIcon />
            </div>
            <div className="stat-info">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#ef4444' }}>
              <TimeIcon />
            </div>
            <div className="stat-info">
              <h3>{stats.overdue}</h3>
              <p>Overdue</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#10b981' }}>
              <MoneyIcon />
            </div>
            <div className="stat-info">
              <h3>${stats.budgetRemaining.toLocaleString()}</h3>
              <p>Budget Remaining</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-container">
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="control-buttons">
            <select
              className="filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>

            <div className="view-toggles">
              <button
                className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                onClick={() => setViewMode('kanban')}
              >
                <KanbanIcon />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <ListIcon />
              </button>
              <button
                className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <CalendarIcon />
              </button>
            </div>

            <Link to="/tasks/new" className="add-task-btn">
              <AddIcon /> New Task
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="task-content">
          {viewMode === 'kanban' && renderKanbanView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'calendar' && renderCalendarView()}
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
