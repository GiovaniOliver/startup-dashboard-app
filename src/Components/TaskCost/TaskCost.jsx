import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import './TaskCost.scss';
import AttachMoney from '@mui/icons-material/AttachMoney';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import PieChart from '@mui/icons-material/PieChart';
import Person from '@mui/icons-material/Person';
import Assignment from '@mui/icons-material/Assignment';
import FilterList from '@mui/icons-material/FilterList';
import taskData, { calculateTaskCost, getTaskStatistics } from '../../data/taskData';

const MoneyIcon = AttachMoney;
const TrendUpIcon = TrendingUp;
const TrendDownIcon = TrendingDown;
const PieIcon = PieChart;
const PersonIcon = Person;
const TaskIcon = Assignment;
const FilterIcon = FilterList;

const TaskCost = () => {
  const [viewMode, setViewMode] = useState('overview'); // overview, byTask, byAssignee
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = getTaskStatistics();

  // Calculate costs by status
  const getCostsByStatus = () => {
    const statuses = ['todo', 'in-progress', 'in-review', 'done'];
    return statuses.map(status => {
      const statusTasks = taskData.filter(t => t.status === status);
      const totalCost = statusTasks.reduce((sum, task) => sum + calculateTaskCost(task), 0);
      const totalBudget = statusTasks.reduce((sum, task) => sum + task.budget, 0);
      return {
        status,
        totalCost,
        totalBudget,
        variance: totalBudget - totalCost,
        count: statusTasks.length
      };
    });
  };

  // Calculate costs by assignee
  const getCostsByAssignee = () => {
    const assigneeMap = new Map();

    taskData.forEach(task => {
      const key = `${task.assigneeType}-${task.assigneeId}`;
      if (!assigneeMap.has(key)) {
        assigneeMap.set(key, {
          name: task.assigneeName,
          type: task.assigneeType,
          hourlyRate: task.assigneeHourlyRate,
          tasks: [],
          totalHours: 0,
          totalCost: 0,
          totalBudget: 0
        });
      }

      const assignee = assigneeMap.get(key);
      assignee.tasks.push(task);
      assignee.totalHours += task.actualHours;
      assignee.totalCost += calculateTaskCost(task);
      assignee.totalBudget += task.budget;
    });

    return Array.from(assigneeMap.values()).sort((a, b) => b.totalCost - a.totalCost);
  };

  // Filter tasks
  const getFilteredTasks = () => {
    if (filterStatus === 'all') return taskData;
    return taskData.filter(task => task.status === filterStatus);
  };

  const costsByStatus = getCostsByStatus();
  const costsByAssignee = getCostsByAssignee();
  const filteredTasks = getFilteredTasks();

  // Calculate ROI (simple version based on budget efficiency)
  const calculateROI = (task) => {
    const actualCost = calculateTaskCost(task);
    if (actualCost === 0) return 0;
    const efficiency = ((task.budget - actualCost) / task.budget) * 100;
    return efficiency;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#6b7280';
      case 'in-progress': return '#3b82f6';
      case 'in-review': return '#f59e0b';
      case 'done': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'in-review': return 'In Review';
      case 'done': return 'Done';
      default: return status;
    }
  };

  return (
    <div className="taskCost">
      <Sidebar />
      <div className="taskCostContainer">
        <Navbar />

        <div className="cost-content">
          {/* Header */}
          <div className="cost-header">
            <h1>Task Cost Analysis</h1>
            <div className="view-tabs">
              <button
                className={viewMode === 'overview' ? 'active' : ''}
                onClick={() => setViewMode('overview')}
              >
                Overview
              </button>
              <button
                className={viewMode === 'byTask' ? 'active' : ''}
                onClick={() => setViewMode('byTask')}
              >
                By Task
              </button>
              <button
                className={viewMode === 'byAssignee' ? 'active' : ''}
                onClick={() => setViewMode('byAssignee')}
              >
                By Assignee
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon" style={{ backgroundColor: '#3b82f6' }}>
                <MoneyIcon />
              </div>
              <div className="card-content">
                <h3>${stats.totalBudget.toLocaleString()}</h3>
                <p>Total Budget</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon" style={{ backgroundColor: '#ef4444' }}>
                <MoneyIcon />
              </div>
              <div className="card-content">
                <h3>${stats.totalActualCost.toLocaleString()}</h3>
                <p>Actual Cost</p>
              </div>
            </div>

            <div className="summary-card">
              <div className={`card-icon ${stats.budgetRemaining >= 0 ? 'positive' : 'negative'}`}>
                {stats.budgetRemaining >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
              </div>
              <div className="card-content">
                <h3 className={stats.budgetRemaining >= 0 ? 'positive' : 'negative'}>
                  ${Math.abs(stats.budgetRemaining).toLocaleString()}
                </h3>
                <p>{stats.budgetRemaining >= 0 ? 'Budget Remaining' : 'Over Budget'}</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon" style={{ backgroundColor: '#f59e0b' }}>
                <TaskIcon />
              </div>
              <div className="card-content">
                <h3>{stats.total}</h3>
                <p>Total Tasks</p>
              </div>
            </div>
          </div>

          {/* Overview View */}
          {viewMode === 'overview' && (
            <div className="overview-section">
              {/* Cost by Status */}
              <div className="cost-chart-card">
                <h2>Cost Breakdown by Status</h2>
                <div className="status-breakdown">
                  {costsByStatus.map(item => (
                    <div key={item.status} className="status-item">
                      <div className="status-header">
                        <div className="status-label">
                          <div
                            className="status-dot"
                            style={{ backgroundColor: getStatusColor(item.status) }}
                          ></div>
                          <span>{getStatusLabel(item.status)}</span>
                          <span className="task-count">({item.count} tasks)</span>
                        </div>
                        <div className="status-amount">
                          ${item.totalCost.toLocaleString()} / ${item.totalBudget.toLocaleString()}
                        </div>
                      </div>
                      <div className="status-bar">
                        <div
                          className="status-progress"
                          style={{
                            width: `${Math.min((item.totalCost / item.totalBudget) * 100, 100)}%`,
                            backgroundColor: getStatusColor(item.status)
                          }}
                        ></div>
                      </div>
                      <div className="status-variance">
                        <span className={item.variance >= 0 ? 'positive' : 'negative'}>
                          {item.variance >= 0 ? '+' : '-'}${Math.abs(item.variance).toLocaleString()} variance
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost by Assignee Preview */}
              <div className="cost-chart-card">
                <h2>Top Assignees by Cost</h2>
                <div className="assignee-list">
                  {costsByAssignee.slice(0, 5).map((assignee, idx) => (
                    <div key={idx} className="assignee-item">
                      <div className="assignee-info">
                        <div className="assignee-avatar">
                          {assignee.name.charAt(0)}
                        </div>
                        <div className="assignee-details">
                          <strong>{assignee.name}</strong>
                          <span className="assignee-type">
                            {assignee.type === 'team' ? 'Team Member' : 'Intern'} • {assignee.tasks.length} tasks
                          </span>
                        </div>
                      </div>
                      <div className="assignee-cost">
                        <div className="cost-amount">${assignee.totalCost.toLocaleString()}</div>
                        <div className="cost-hours">{assignee.totalHours}h</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* By Task View */}
          {viewMode === 'byTask' && (
            <div className="by-task-section">
              <div className="filter-bar">
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
              </div>

              <div className="task-cost-table">
                <table>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Assignee</th>
                      <th>Status</th>
                      <th>Hours (Est/Act)</th>
                      <th>Budget</th>
                      <th>Actual Cost</th>
                      <th>Variance</th>
                      <th>Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map(task => {
                      const actualCost = calculateTaskCost(task);
                      const variance = task.budget - actualCost;
                      const efficiency = calculateROI(task);

                      return (
                        <tr key={task.id}>
                          <td>
                            <Link to={`/tasks/${task.id}`} className="task-link">
                              {task.title}
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
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(task.status) }}
                            >
                              {getStatusLabel(task.status)}
                            </span>
                          </td>
                          <td>
                            <span className={task.actualHours > task.estimatedHours ? 'over' : ''}>
                              {task.estimatedHours}h / {task.actualHours}h
                            </span>
                          </td>
                          <td>${task.budget.toLocaleString()}</td>
                          <td>${actualCost.toLocaleString()}</td>
                          <td className={variance >= 0 ? 'positive' : 'negative'}>
                            {variance >= 0 ? '+' : '-'}${Math.abs(variance).toLocaleString()}
                          </td>
                          <td>
                            <div className="efficiency-bar">
                              <div
                                className={`efficiency-fill ${efficiency >= 0 ? 'positive' : 'negative'}`}
                                style={{
                                  width: `${Math.min(Math.abs(efficiency), 100)}%`
                                }}
                              ></div>
                              <span className="efficiency-text">
                                {efficiency >= 0 ? '+' : ''}{efficiency.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* By Assignee View */}
          {viewMode === 'byAssignee' && (
            <div className="by-assignee-section">
              <div className="assignee-cost-cards">
                {costsByAssignee.map((assignee, idx) => {
                  const variance = assignee.totalBudget - assignee.totalCost;
                  const avgCostPerTask = assignee.totalCost / assignee.tasks.length;

                  return (
                    <div key={idx} className="assignee-cost-card">
                      <div className="card-header">
                        <div className="assignee-info-large">
                          <div className="assignee-avatar-large">
                            {assignee.name.charAt(0)}
                          </div>
                          <div>
                            <h3>{assignee.name}</h3>
                            <p className="assignee-type">
                              {assignee.type === 'team' ? 'Team Member' : 'Intern'} • ${assignee.hourlyRate}/hr
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="card-stats">
                        <div className="stat-row">
                          <span className="stat-label">Total Tasks:</span>
                          <span className="stat-value">{assignee.tasks.length}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Total Hours:</span>
                          <span className="stat-value">{assignee.totalHours}h</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Total Budget:</span>
                          <span className="stat-value">${assignee.totalBudget.toLocaleString()}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Actual Cost:</span>
                          <span className="stat-value">${assignee.totalCost.toLocaleString()}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Variance:</span>
                          <span className={`stat-value ${variance >= 0 ? 'positive' : 'negative'}`}>
                            {variance >= 0 ? '+' : '-'}${Math.abs(variance).toLocaleString()}
                          </span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Avg Cost/Task:</span>
                          <span className="stat-value">${avgCostPerTask.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="card-tasks">
                        <h4>Tasks ({assignee.tasks.length})</h4>
                        <ul>
                          {assignee.tasks.slice(0, 5).map(task => (
                            <li key={task.id}>
                              <Link to={`/tasks/${task.id}`}>
                                {task.title}
                                <span className="task-cost">${calculateTaskCost(task).toLocaleString()}</span>
                              </Link>
                            </li>
                          ))}
                          {assignee.tasks.length > 5 && (
                            <li className="more-tasks">+{assignee.tasks.length - 5} more tasks</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCost;
