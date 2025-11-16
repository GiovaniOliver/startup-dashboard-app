/**
 * useTeams Hook - Custom hook for team data operations
 */

import { useMemo } from 'react';
import { useDataContext } from '../Context/DataContext';
import * as dataManager from '../utils/dataManager';

export const useTeams = () => {
  const {
    teams,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamById,
    searchTeams,
    getInternsByTeam,
    getTasksByTeam,
    getFinancesByTeam,
    interns,
    tasks,
    finances,
  } = useDataContext();

  // Team statistics
  const teamStats = useMemo(() => {
    return {
      total: teams.length,
      totalBudget: teams.reduce((sum, team) => sum + (team.budget || 0), 0),
      totalMembers: teams.reduce((sum, team) => sum + (team.memberCount || 0), 0),
      averageBudget: teams.length > 0 ? teams.reduce((sum, team) => sum + (team.budget || 0), 0) / teams.length : 0,
    };
  }, [teams]);

  // Get team with additional data
  const getTeamWithDetails = (teamId) => {
    const team = getTeamById(teamId);
    if (!team) return null;

    const teamInterns = getInternsByTeam(teamId);
    const teamTasks = getTasksByTeam(teamId);
    const teamFinances = getFinancesByTeam(teamId);
    const budgetUtilization = dataManager.calculateTeamBudgetUtilization(team, finances);

    return {
      ...team,
      interns: teamInterns,
      tasks: teamTasks,
      finances: teamFinances,
      internCount: teamInterns.length,
      taskCount: teamTasks.length,
      completedTasks: teamTasks.filter(t => t.status === 'completed').length,
      budgetUtilization,
    };
  };

  // Get all teams with details
  const teamsWithDetails = useMemo(() => {
    return teams.map(team => getTeamWithDetails(team.id));
  }, [teams, interns, tasks, finances]);

  // Sort teams
  const sortTeams = (field, direction = 'asc') => {
    return dataManager.sortItems(teams, field, direction);
  };

  // Filter teams
  const filterTeams = (filters) => {
    return dataManager.filterItems(teams, filters);
  };

  return {
    // Data
    teams,
    teamStats,
    teamsWithDetails,

    // Operations
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamById,
    getTeamWithDetails,
    searchTeams,
    sortTeams,
    filterTeams,

    // Related data
    getInternsByTeam,
    getTasksByTeam,
    getFinancesByTeam,
  };
};

export default useTeams;
