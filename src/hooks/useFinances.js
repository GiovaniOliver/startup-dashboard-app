/**
 * useFinances Hook - Custom hook for finance data operations
 */

import { useMemo } from 'react';
import { useDataContext } from '../Context/DataContext';
import * as dataManager from '../utils/dataManager';

export const useFinances = () => {
  const {
    finances,
    createFinance,
    updateFinance,
    deleteFinance,
    getFinanceById,
    getFinancesByTeam,
    getFinancesByIntern,
    getTeamById,
    getInternById,
    teams,
  } = useDataContext();

  // Finance statistics
  const financeStats = useMemo(() => {
    const totalExpenses = dataManager.calculateTotalExpenses(finances);
    const totalRevenue = dataManager.calculateTotalRevenue(finances);
    const netIncome = totalRevenue - totalExpenses;

    const expensesByCategory = {};
    finances.filter(f => f.type === 'expense').forEach(finance => {
      const category = finance.category || 'other';
      expensesByCategory[category] = (expensesByCategory[category] || 0) + finance.amount;
    });

    const pendingPayments = finances.filter(f => f.status === 'pending');
    const totalPending = pendingPayments.reduce((sum, f) => sum + (f.amount || 0), 0);

    return {
      totalExpenses,
      totalRevenue,
      netIncome,
      profitMargin: totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0,
      expensesByCategory,
      transactionCount: finances.length,
      pendingCount: pendingPayments.length,
      totalPending,
      averageTransaction: finances.length > 0
        ? finances.reduce((sum, f) => sum + (f.amount || 0), 0) / finances.length
        : 0,
    };
  }, [finances]);

  // Get finance with additional data
  const getFinanceWithDetails = (financeId) => {
    const finance = getFinanceById(financeId);
    if (!finance) return null;

    const team = finance.teamId ? getTeamById(finance.teamId) : null;
    const intern = finance.internId ? getInternById(finance.internId) : null;

    return {
      ...finance,
      team,
      intern,
    };
  };

  // Get all finances with details
  const financesWithDetails = useMemo(() => {
    return finances.map(finance => getFinanceWithDetails(finance.id));
  }, [finances]);

  // Get finances by type
  const getFinancesByType = (type) => {
    return finances.filter(finance => finance.type === type);
  };

  // Get finances by category
  const getFinancesByCategory = (category) => {
    return finances.filter(finance => finance.category === category);
  };

  // Get finances by status
  const getFinancesByStatus = (status) => {
    return finances.filter(finance => finance.status === status);
  };

  // Get finances by date range
  const getFinancesByDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return finances.filter(finance => {
      const financeDate = new Date(finance.date);
      return financeDate >= start && financeDate <= endDate;
    });
  };

  // Get monthly summary
  const getMonthlySummary = (year, month) => {
    const monthFinances = finances.filter(finance => {
      const financeDate = new Date(finance.date);
      return financeDate.getFullYear() === year && financeDate.getMonth() === month;
    });

    const expenses = monthFinances.filter(f => f.type === 'expense')
      .reduce((sum, f) => sum + (f.amount || 0), 0);
    const revenue = monthFinances.filter(f => f.type === 'revenue')
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    return {
      year,
      month,
      expenses,
      revenue,
      netIncome: revenue - expenses,
      transactionCount: monthFinances.length,
      transactions: monthFinances,
    };
  };

  // Get yearly summary
  const getYearlySummary = (year) => {
    const yearFinances = finances.filter(finance => {
      const financeDate = new Date(finance.date);
      return financeDate.getFullYear() === year;
    });

    const expenses = yearFinances.filter(f => f.type === 'expense')
      .reduce((sum, f) => sum + (f.amount || 0), 0);
    const revenue = yearFinances.filter(f => f.type === 'revenue')
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    // Monthly breakdown
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      return getMonthlySummary(year, i);
    });

    return {
      year,
      expenses,
      revenue,
      netIncome: revenue - expenses,
      transactionCount: yearFinances.length,
      monthlyData,
    };
  };

  // Get team budget overview
  const getTeamBudgetOverview = () => {
    return teams.map(team => {
      const budgetUtilization = dataManager.calculateTeamBudgetUtilization(team, finances);
      return {
        teamId: team.id,
        teamName: team.name,
        ...budgetUtilization,
      };
    });
  };

  // Get expense trend (last N months)
  const getExpenseTrend = (months = 6) => {
    const now = new Date();
    const trendData = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const summary = getMonthlySummary(date.getFullYear(), date.getMonth());

      trendData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        expenses: summary.expenses,
        revenue: summary.revenue,
        netIncome: summary.netIncome,
      });
    }

    return trendData;
  };

  // Get top expenses
  const getTopExpenses = (limit = 10) => {
    return [...finances]
      .filter(f => f.type === 'expense')
      .sort((a, b) => (b.amount || 0) - (a.amount || 0))
      .slice(0, limit);
  };

  // Get recent transactions
  const getRecentTransactions = (limit = 10) => {
    return [...finances]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Sort finances
  const sortFinances = (field, direction = 'asc') => {
    return dataManager.sortItems(finances, field, direction);
  };

  // Filter finances
  const filterFinances = (filters) => {
    return dataManager.filterItems(finances, filters);
  };

  return {
    // Data
    finances,
    financeStats,
    financesWithDetails,

    // Operations
    createFinance,
    updateFinance,
    deleteFinance,
    getFinanceById,
    getFinanceWithDetails,
    sortFinances,
    filterFinances,

    // Queries
    getFinancesByType,
    getFinancesByCategory,
    getFinancesByStatus,
    getFinancesByTeam,
    getFinancesByIntern,
    getFinancesByDateRange,
    getTopExpenses,
    getRecentTransactions,

    // Analytics
    getMonthlySummary,
    getYearlySummary,
    getTeamBudgetOverview,
    getExpenseTrend,
  };
};

export default useFinances;
