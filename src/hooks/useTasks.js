/**
 * useTasks Hook - Custom hook for task data operations
 */

import { useMemo } from 'react';
import { useDataContext } from '../Context/DataContext';
import * as dataManager from '../utils/dataManager';

export const useTasks = () => {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    searchTasks,
    getTasksByTeam,
    getTasksByIntern,
    getTeamById,
    getInternById,
  } = useDataContext();

  // Task statistics
  const taskStats = useMemo(() => {
    const stats = dataManager.getTaskStatistics(tasks);
    const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    const totalActualHours = tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const avgProgress = tasks.length > 0
      ? tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / tasks.length
      : 0;

    return {
      ...stats,
      totalEstimatedHours,
      totalActualHours,
      averageProgress: avgProgress,
      completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
      onTimeCompletion: completedTasks.filter(t => {
        if (!t.dueDate) return true;
        const dueDate = new Date(t.dueDate);
        const completedDate = new Date(t.updatedAt || t.createdAt);
        return completedDate <= dueDate;
      }).length,
    };
  }, [tasks]);

  // Get task with additional data
  const getTaskWithDetails = (taskId) => {
    const task = getTaskById(taskId);
    if (!task) return null;

    const team = task.teamId ? getTeamById(task.teamId) : null;
    const assignee = task.assignedTo ? getInternById(task.assignedTo) : null;
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    const daysUntilDue = task.dueDate
      ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      ...task,
      team,
      assignee,
      isOverdue,
      daysUntilDue,
      hoursRemaining: (task.estimatedHours || 0) - (task.actualHours || 0),
    };
  };

  // Get all tasks with details
  const tasksWithDetails = useMemo(() => {
    return tasks.map(task => getTaskWithDetails(task.id));
  }, [tasks]);

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Get tasks by priority
  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  // Get overdue tasks
  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task =>
      task.dueDate &&
      new Date(task.dueDate) < now &&
      task.status !== 'completed'
    );
  };

  // Get upcoming tasks
  const getUpcomingTasks = (days = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= futureDate;
    });
  };

  // Get unassigned tasks
  const getUnassignedTasks = () => {
    return tasks.filter(task => !task.assignedTo);
  };

  // Get high priority tasks
  const getHighPriorityTasks = () => {
    return tasks.filter(task => task.priority === 'high' && task.status !== 'completed');
  };

  // Sort tasks
  const sortTasks = (field, direction = 'asc') => {
    return dataManager.sortItems(tasks, field, direction);
  };

  // Filter tasks
  const filterTasks = (filters) => {
    return dataManager.filterItems(tasks, filters);
  };

  // Get task completion trend (last 30 days)
  const getCompletionTrend = () => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const completedInLast30Days = tasks.filter(task => {
      if (task.status !== 'completed' || !task.updatedAt) return false;
      return new Date(task.updatedAt) >= last30Days;
    });

    // Group by date
    const trendData = {};
    completedInLast30Days.forEach(task => {
      const date = new Date(task.updatedAt).toISOString().split('T')[0];
      trendData[date] = (trendData[date] || 0) + 1;
    });

    return Object.entries(trendData).map(([date, count]) => ({
      date,
      count,
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  return {
    // Data
    tasks,
    taskStats,
    tasksWithDetails,

    // Operations
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTaskWithDetails,
    searchTasks,
    sortTasks,
    filterTasks,

    // Queries
    getTasksByStatus,
    getTasksByPriority,
    getTasksByTeam,
    getTasksByIntern,
    getOverdueTasks,
    getUpcomingTasks,
    getUnassignedTasks,
    getHighPriorityTasks,

    // Analytics
    getCompletionTrend,
  };
};

export default useTasks;
