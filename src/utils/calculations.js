// Utility functions for financial calculations

/**
 * Calculate gross pay including salary and bonuses
 */
export const calculateGrossPay = (monthlySalary, bonuses = 0) => {
  return monthlySalary + bonuses;
};

/**
 * Calculate tax deduction based on tax rate
 */
export const calculateTaxDeduction = (grossPay, taxRate) => {
  return grossPay * taxRate;
};

/**
 * Calculate net pay after deductions
 */
export const calculateNetPay = (grossPay, deductions) => {
  return grossPay - deductions;
};

/**
 * Calculate intern stipend based on days worked
 */
export const calculateInternStipend = (stipendPerDay, daysWorked) => {
  return stipendPerDay * daysWorked;
};

/**
 * Calculate total team salaries
 */
export const calculateTotalTeamSalaries = (teamMembers) => {
  return teamMembers.reduce((total, member) => {
    return total + member.monthlySalary + (member.bonuses || 0);
  }, 0);
};

/**
 * Calculate total intern stipends
 */
export const calculateTotalInternStipends = (interns) => {
  return interns.reduce((total, intern) => {
    return total + (intern.stipendPerDay * intern.daysWorked);
  }, 0);
};

/**
 * Calculate budget utilization percentage
 */
export const calculateBudgetUtilization = (spent, budget) => {
  if (budget === 0) return 0;
  return (spent / budget) * 100;
};

/**
 * Calculate remaining budget
 */
export const calculateRemainingBudget = (budget, spent) => {
  return budget - spent;
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculate days between two dates
 */
export const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calculate months between two dates
 */
export const calculateMonthsBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = (end.getFullYear() - start.getFullYear()) * 12 +
                  (end.getMonth() - start.getMonth());
  return months;
};

/**
 * Generate pay stub data
 */
export const generatePayStub = (employee, period) => {
  const grossPay = calculateGrossPay(employee.monthlySalary, employee.bonuses);
  const taxDeduction = calculateTaxDeduction(grossPay, employee.taxRate);
  const netPay = calculateNetPay(grossPay, taxDeduction);

  return {
    employeeName: employee.name,
    employeeId: employee.id,
    period: period,
    grossPay: grossPay,
    deductions: {
      tax: taxDeduction,
      total: taxDeduction,
    },
    netPay: netPay,
    paymentMethod: employee.paymentMethod,
    accountNumber: employee.accountNumber,
    generatedDate: new Date().toISOString(),
  };
};

/**
 * Forecast future costs based on historical data
 */
export const forecastCosts = (monthlyData, monthsAhead = 3) => {
  if (monthlyData.length < 2) return [];

  // Simple linear regression for forecasting
  const recentMonths = monthlyData.slice(-6); // Use last 6 months
  const avgGrowthRate = recentMonths.reduce((acc, month, idx) => {
    if (idx === 0) return acc;
    return acc + (month.total - recentMonths[idx - 1].total) / recentMonths[idx - 1].total;
  }, 0) / (recentMonths.length - 1);

  const lastMonth = monthlyData[monthlyData.length - 1];
  const forecast = [];

  for (let i = 1; i <= monthsAhead; i++) {
    const forecastedTotal = lastMonth.total * Math.pow(1 + avgGrowthRate, i);
    forecast.push({
      month: `Month +${i}`,
      total: Math.round(forecastedTotal),
      teamSalary: Math.round(forecastedTotal * 0.7),
      internStipend: Math.round(forecastedTotal * 0.1),
      tasks: Math.round(forecastedTotal * 0.2),
      isForecast: true,
    });
  }

  return forecast;
};

/**
 * Calculate year-to-date totals
 */
export const calculateYTD = (monthlyData) => {
  return monthlyData.reduce((acc, month) => {
    return {
      teamSalary: acc.teamSalary + month.teamSalary,
      internStipend: acc.internStipend + month.internStipend,
      tasks: acc.tasks + month.tasks,
      total: acc.total + month.total,
    };
  }, { teamSalary: 0, internStipend: 0, tasks: 0, total: 0 });
};

/**
 * Calculate average monthly spending
 */
export const calculateAverageMonthlySpending = (monthlyData) => {
  if (monthlyData.length === 0) return 0;
  const total = monthlyData.reduce((sum, month) => sum + month.total, 0);
  return total / monthlyData.length;
};

/**
 * Get budget status (healthy, warning, critical)
 */
export const getBudgetStatus = (utilizationPercentage) => {
  if (utilizationPercentage < 70) return { status: 'healthy', color: '#4caf50' };
  if (utilizationPercentage < 90) return { status: 'warning', color: '#ff9800' };
  return { status: 'critical', color: '#f44336' };
};

/**
 * Calculate overtime pay (if applicable)
 */
export const calculateOvertimePay = (hoursWorked, regularHours, hourlyRate, overtimeMultiplier = 1.5) => {
  if (hoursWorked <= regularHours) return 0;
  const overtimeHours = hoursWorked - regularHours;
  return overtimeHours * hourlyRate * overtimeMultiplier;
};

/**
 * Calculate prorated salary for partial month
 */
export const calculateProratedSalary = (monthlySalary, daysWorked, totalDaysInMonth) => {
  return (monthlySalary / totalDaysInMonth) * daysWorked;
};

/**
 * Sort payment history by date
 */
export const sortPaymentsByDate = (payments, ascending = false) => {
  return [...payments].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Filter payments by date range
 */
export const filterPaymentsByDateRange = (payments, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return payments.filter(payment => {
    const paymentDate = new Date(payment.date);
    return paymentDate >= start && paymentDate <= end;
  });
};

/**
 * Group payments by employee
 */
export const groupPaymentsByEmployee = (payments) => {
  return payments.reduce((acc, payment) => {
    if (!acc[payment.employeeName]) {
      acc[payment.employeeName] = [];
    }
    acc[payment.employeeName].push(payment);
    return acc;
  }, {});
};

/**
 * Calculate tax based on progressive tax brackets
 */
export const calculateProgressiveTax = (income, taxBrackets) => {
  let totalTax = 0;
  let remainingIncome = income;

  for (const bracket of taxBrackets) {
    if (remainingIncome <= 0) break;

    const bracketRange = bracket.max - bracket.min;
    const taxableInThisBracket = Math.min(remainingIncome, bracketRange);
    totalTax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;
  }

  return totalTax;
};
