import React, { useState, useMemo } from 'react';
import './financialOverview.scss';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import BudgetManager from '../../Components/BudgetManager/BudgetManager';
import FinancialReport from '../../Components/Reports/FinancialReport';
import {
  teamMembers,
  interns,
  expenseCategories,
  monthlySpendingTrend,
  budgetAllocations,
} from '../../data/financialData';
import {
  calculateTotalTeamSalaries,
  calculateTotalInternStipends,
  formatCurrency,
  forecastCosts,
  calculateYTD,
  calculateAverageMonthlySpending,
} from '../../utils/calculations';

const FinancialOverview = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Memoize expensive calculations to avoid recalculating on every render
  const totalTeamSalaries = useMemo(() => calculateTotalTeamSalaries(teamMembers), []);
  const totalInternStipends = useMemo(() => calculateTotalInternStipends(interns), []);
  const totalTaskCosts = 8000; // From data
  const totalMonthly = useMemo(() =>
    totalTeamSalaries + totalInternStipends + totalTaskCosts,
    [totalTeamSalaries, totalInternStipends]
  );

  const ytdData = useMemo(() => calculateYTD(monthlySpendingTrend), []);
  const avgMonthlySpending = useMemo(() => calculateAverageMonthlySpending(monthlySpendingTrend), []);
  const forecastData = useMemo(() => forecastCosts(monthlySpendingTrend, 3), []);

  // Calculate total budget and spent
  const totalBudget = useMemo(() => budgetAllocations.reduce((sum, b) => sum + b.budgetAmount, 0), []);
  const totalSpent = useMemo(() => budgetAllocations.reduce((sum, b) => sum + b.spent, 0), []);
  const budgetUtilization = useMemo(() => (totalSpent / totalBudget) * 100, [totalSpent, totalBudget]);

  return (
    <div className="financialOverview">
      <Sidebar />
      <div className="financialOverviewContainer">
        <Navbar />
        <div className="overviewContent">
          <div className="header">
            <h1>Financial Overview Dashboard</h1>
            <div className="controls">
              <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <div className="viewTabs">
                <button
                  className={selectedView === 'overview' ? 'active' : ''}
                  onClick={() => setSelectedView('overview')}
                >
                  Overview
                </button>
                <button
                  className={selectedView === 'budget' ? 'active' : ''}
                  onClick={() => setSelectedView('budget')}
                >
                  Budget
                </button>
                <button
                  className={selectedView === 'reports' ? 'active' : ''}
                  onClick={() => setSelectedView('reports')}
                >
                  Reports
                </button>
              </div>
            </div>
          </div>

          {selectedView === 'overview' && (
            <>
              {/* Key Metrics */}
              <div className="metricsGrid">
                <div className="metricCard primary">
                  <div className="metricIcon">💰</div>
                  <div className="metricContent">
                    <div className="metricLabel">Total Monthly Costs</div>
                    <div className="metricValue">{formatCurrency(totalMonthly)}</div>
                    <div className="metricChange positive">+5.2% from last month</div>
                  </div>
                </div>
                <div className="metricCard">
                  <div className="metricIcon">👥</div>
                  <div className="metricContent">
                    <div className="metricLabel">Team Salaries</div>
                    <div className="metricValue">{formatCurrency(totalTeamSalaries)}</div>
                    <div className="metricPercentage">
                      {((totalTeamSalaries / totalMonthly) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
                <div className="metricCard">
                  <div className="metricIcon">🎓</div>
                  <div className="metricContent">
                    <div className="metricLabel">Intern Stipends</div>
                    <div className="metricValue">{formatCurrency(totalInternStipends)}</div>
                    <div className="metricPercentage">
                      {((totalInternStipends / totalMonthly) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
                <div className="metricCard">
                  <div className="metricIcon">📋</div>
                  <div className="metricContent">
                    <div className="metricLabel">Task Costs</div>
                    <div className="metricValue">{formatCurrency(totalTaskCosts)}</div>
                    <div className="metricPercentage">
                      {((totalTaskCosts / totalMonthly) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="chartsSection">
                {/* Budget Allocation Pie Chart */}
                <div className="chartCard">
                  <h2>Budget Allocation by Category</h2>
                  <div className="pieChartContainer">
                    <svg viewBox="0 0 200 200" className="pieChart">
                      {(() => {
                        let currentAngle = 0;
                        return expenseCategories.map((category, index) => {
                          const percentage = category.percentage;
                          const angle = (percentage / 100) * 360;
                          const startAngle = currentAngle;
                          const endAngle = currentAngle + angle;
                          currentAngle = endAngle;

                          const startX = 100 + 80 * Math.cos((startAngle - 90) * (Math.PI / 180));
                          const startY = 100 + 80 * Math.sin((startAngle - 90) * (Math.PI / 180));
                          const endX = 100 + 80 * Math.cos((endAngle - 90) * (Math.PI / 180));
                          const endY = 100 + 80 * Math.sin((endAngle - 90) * (Math.PI / 180));
                          const largeArcFlag = angle > 180 ? 1 : 0;

                          const colors = ['#7451f8', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
                          const color = colors[index % colors.length];

                          return (
                            <path
                              key={category.name}
                              d={`M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                              fill={color}
                              stroke="white"
                              strokeWidth="2"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="chartLegend">
                      {expenseCategories.map((category, index) => {
                        const colors = ['#7451f8', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
                        return (
                          <div key={category.name} className="legendItem">
                            <span
                              className="legendColor"
                              style={{ background: colors[index % colors.length] }}
                            ></span>
                            <span className="legendLabel">{category.name}</span>
                            <span className="legendValue">{formatCurrency(category.amount)}</span>
                            <span className="legendPercent">({category.percentage}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Spending Trends Line Chart */}
                <div className="chartCard wide">
                  <h2>Spending Trends Over Time</h2>
                  <div className="lineChartContainer">
                    <div className="chartHeader">
                      <div className="chartLegend horizontal">
                        <div className="legendItem">
                          <span className="legendColor" style={{ background: '#7451f8' }}></span>
                          <span>Team Salary</span>
                        </div>
                        <div className="legendItem">
                          <span className="legendColor" style={{ background: '#4ecdc4' }}></span>
                          <span>Intern Stipend</span>
                        </div>
                        <div className="legendItem">
                          <span className="legendColor" style={{ background: '#ff6b6b' }}></span>
                          <span>Tasks</span>
                        </div>
                        <div className="legendItem">
                          <span className="legendColor" style={{ background: '#45b7d1' }}></span>
                          <span>Total</span>
                        </div>
                      </div>
                    </div>
                    <div className="lineChart">
                      <svg viewBox="0 0 800 300" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="totalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#45b7d1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#45b7d1" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <line
                            key={i}
                            x1="0"
                            y1={i * 60}
                            x2="800"
                            y2={i * 60}
                            stroke="#e0e0e0"
                            strokeWidth="1"
                          />
                        ))}
                        {/* Total line with area */}
                        <path
                          d={monthlySpendingTrend
                            .map((month, i) => {
                              const x = (i / (monthlySpendingTrend.length - 1)) * 800;
                              const y = 300 - (month.total / 600) * 300;
                              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                            })
                            .join(' ')}
                          fill="none"
                          stroke="#45b7d1"
                          strokeWidth="3"
                        />
                        <path
                          d={
                            monthlySpendingTrend
                              .map((month, i) => {
                                const x = (i / (monthlySpendingTrend.length - 1)) * 800;
                                const y = 300 - (month.total / 600) * 300;
                                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                              })
                              .join(' ') + ' L 800 300 L 0 300 Z'
                          }
                          fill="url(#totalGradient)"
                        />
                        {/* Team Salary line */}
                        <path
                          d={monthlySpendingTrend
                            .map((month, i) => {
                              const x = (i / (monthlySpendingTrend.length - 1)) * 800;
                              const y = 300 - (month.teamSalary / 600) * 300;
                              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                            })
                            .join(' ')}
                          fill="none"
                          stroke="#7451f8"
                          strokeWidth="2"
                        />
                        {/* Intern Stipend line */}
                        <path
                          d={monthlySpendingTrend
                            .map((month, i) => {
                              const x = (i / (monthlySpendingTrend.length - 1)) * 800;
                              const y = 300 - (month.internStipend / 600) * 300;
                              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                            })
                            .join(' ')}
                          fill="none"
                          stroke="#4ecdc4"
                          strokeWidth="2"
                        />
                      </svg>
                      <div className="xAxis">
                        {monthlySpendingTrend.map((month) => (
                          <span key={month.month}>{month.month}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* YTD Summary & Forecast */}
              <div className="summarySection">
                <div className="summaryCard">
                  <h3>Year-to-Date Summary</h3>
                  <div className="summaryGrid">
                    <div className="summaryItem">
                      <label>Team Salaries:</label>
                      <value>{formatCurrency(ytdData.teamSalary)}</value>
                    </div>
                    <div className="summaryItem">
                      <label>Intern Stipends:</label>
                      <value>{formatCurrency(ytdData.internStipend)}</value>
                    </div>
                    <div className="summaryItem">
                      <label>Task Costs:</label>
                      <value>{formatCurrency(ytdData.tasks)}</value>
                    </div>
                    <div className="summaryItem highlight">
                      <label>Total YTD:</label>
                      <value>{formatCurrency(ytdData.total)}</value>
                    </div>
                  </div>
                </div>

                <div className="summaryCard">
                  <h3>3-Month Forecast</h3>
                  <div className="forecastGrid">
                    {forecastData.map((forecast) => (
                      <div key={forecast.month} className="forecastItem">
                        <div className="forecastMonth">{forecast.month}</div>
                        <div className="forecastAmount">{formatCurrency(forecast.total)}</div>
                        <div className="forecastBreakdown">
                          <small>Team: {formatCurrency(forecast.teamSalary)}</small>
                          <small>Interns: {formatCurrency(forecast.internStipend)}</small>
                          <small>Tasks: {formatCurrency(forecast.tasks)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summaryCard">
                  <h3>Budget Status</h3>
                  <div className="budgetStatus">
                    <div className="budgetProgress">
                      <div className="progressBar">
                        <div
                          className="progress"
                          style={{
                            width: `${budgetUtilization}%`,
                            background:
                              budgetUtilization > 90
                                ? '#f44336'
                                : budgetUtilization > 70
                                ? '#ff9800'
                                : '#4caf50',
                          }}
                        ></div>
                      </div>
                      <div className="budgetLabels">
                        <span>Spent: {formatCurrency(totalSpent)}</span>
                        <span>Budget: {formatCurrency(totalBudget)}</span>
                      </div>
                    </div>
                    <div className="budgetUtilization">{budgetUtilization.toFixed(1)}% Utilized</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedView === 'budget' && <BudgetManager />}
          {selectedView === 'reports' && <FinancialReport />}
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
