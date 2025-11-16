/**
 * useInterns Hook - Custom hook for intern data operations
 */

import { useMemo } from 'react';
import { useDataContext } from '../Context/DataContext';
import * as dataManager from '../utils/dataManager';

export const useInterns = () => {
  const {
    interns,
    createIntern,
    updateIntern,
    deleteIntern,
    getInternById,
    searchInterns,
    getTasksByIntern,
    getFinancesByIntern,
    getTeamById,
    tasks,
    finances,
  } = useDataContext();

  // Intern statistics
  const internStats = useMemo(() => {
    const stats = dataManager.getInternStatistics(interns);
    const totalSalary = interns.reduce((sum, intern) => {
      return sum + ((intern.hourlyRate || 0) * (intern.hoursWorked || 0));
    }, 0);

    return {
      ...stats,
      totalSalary,
      averageSalary: interns.length > 0 ? totalSalary / interns.length : 0,
      averageHourlyRate: interns.length > 0
        ? interns.reduce((sum, i) => sum + (i.hourlyRate || 0), 0) / interns.length
        : 0,
    };
  }, [interns]);

  // Get intern with additional data
  const getInternWithDetails = (internId) => {
    const intern = getInternById(internId);
    if (!intern) return null;

    const internTasks = getTasksByIntern(internId);
    const internFinances = getFinancesByIntern(internId);
    const team = getTeamById(intern.teamId);
    const totalEarnings = (intern.hourlyRate || 0) * (intern.hoursWorked || 0);

    return {
      ...intern,
      team,
      tasks: internTasks,
      finances: internFinances,
      taskCount: internTasks.length,
      completedTasks: internTasks.filter(t => t.status === 'completed').length,
      pendingTasks: internTasks.filter(t => t.status === 'pending').length,
      inProgressTasks: internTasks.filter(t => t.status === 'in-progress').length,
      totalEarnings,
      totalPayments: internFinances.reduce((sum, f) => sum + (f.amount || 0), 0),
    };
  };

  // Get all interns with details
  const internsWithDetails = useMemo(() => {
    return interns.map(intern => getInternWithDetails(intern.id));
  }, [interns, tasks, finances]);

  // Get interns by status
  const getInternsByStatus = (status) => {
    return interns.filter(intern => intern.status === status);
  };

  // Get interns by team
  const getInternsByTeamId = (teamId) => {
    return interns.filter(intern => intern.teamId === teamId);
  };

  // Get interns by performance
  const getInternsByPerformance = (performance) => {
    return interns.filter(intern => intern.performance === performance);
  };

  // Sort interns
  const sortInterns = (field, direction = 'asc') => {
    return dataManager.sortItems(interns, field, direction);
  };

  // Filter interns
  const filterInterns = (filters) => {
    return dataManager.filterItems(interns, filters);
  };

  // Get top performers
  const getTopPerformers = (limit = 5) => {
    return [...interns]
      .filter(i => i.performance === 'excellent')
      .sort((a, b) => (b.hoursWorked || 0) - (a.hoursWorked || 0))
      .slice(0, limit);
  };

  return {
    // Data
    interns,
    internStats,
    internsWithDetails,

    // Operations
    createIntern,
    updateIntern,
    deleteIntern,
    getInternById,
    getInternWithDetails,
    searchInterns,
    sortInterns,
    filterInterns,

    // Queries
    getInternsByStatus,
    getInternsByTeamId,
    getInternsByPerformance,
    getTopPerformers,

    // Related data
    getTasksByIntern,
    getFinancesByIntern,
  };
};

export default useInterns;
