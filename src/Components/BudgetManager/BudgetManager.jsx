import React, { useState } from 'react';
import './budgetManager.scss';
import { budgetAllocations } from '../../data/financialData';
import {
  calculateBudgetUtilization,
  calculateRemainingBudget,
  formatCurrency,
  formatPercentage,
  getBudgetStatus,
} from '../../utils/calculations';

const BudgetManager = () => {
  const [budgets, setBudgets] = useState(budgetAllocations);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    department: '',
    budgetAmount: '',
    category: '',
  });

  const handleAddBudget = (e) => {
    e.preventDefault();
    const budget = {
      id: budgets.length + 1,
      department: newBudget.department,
      budgetAmount: parseFloat(newBudget.budgetAmount),
      spent: 0,
      category: newBudget.category,
      period: 'Monthly',
    };
    setBudgets([...budgets, budget]);
    setNewBudget({ department: '', budgetAmount: '', category: '' });
    setShowAddModal(false);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="budgetManager">
      <div className="budgetHeader">
        <h2>Budget Management</h2>
        <button className="addBtn" onClick={() => setShowAddModal(true)}>
          + Add Budget
        </button>
      </div>

      {/* Overall Budget Summary */}
      <div className="overallSummary">
        <div className="summaryCard">
          <div className="cardLabel">Total Budget</div>
          <div className="cardValue">{formatCurrency(totalBudget)}</div>
        </div>
        <div className="summaryCard">
          <div className="cardLabel">Total Spent</div>
          <div className="cardValue spent">{formatCurrency(totalSpent)}</div>
        </div>
        <div className="summaryCard">
          <div className="cardLabel">Remaining</div>
          <div className="cardValue remaining">{formatCurrency(totalRemaining)}</div>
        </div>
        <div className="summaryCard">
          <div className="cardLabel">Utilization</div>
          <div className="cardValue">
            {formatPercentage(calculateBudgetUtilization(totalSpent, totalBudget))}
          </div>
        </div>
      </div>

      {/* Department Budgets */}
      <div className="budgetList">
        {budgets.map((budget) => {
          const utilization = calculateBudgetUtilization(budget.spent, budget.budgetAmount);
          const remaining = calculateRemainingBudget(budget.budgetAmount, budget.spent);
          const status = getBudgetStatus(utilization);

          return (
            <div key={budget.id} className="budgetItem">
              <div className="budgetInfo">
                <div className="budgetTitle">
                  <h3>{budget.department}</h3>
                  <span className="budgetCategory">{budget.category}</span>
                </div>
                <div className="budgetStats">
                  <div className="stat">
                    <label>Budget:</label>
                    <value>{formatCurrency(budget.budgetAmount)}</value>
                  </div>
                  <div className="stat">
                    <label>Spent:</label>
                    <value>{formatCurrency(budget.spent)}</value>
                  </div>
                  <div className="stat">
                    <label>Remaining:</label>
                    <value className={remaining < 0 ? 'negative' : 'positive'}>
                      {formatCurrency(Math.abs(remaining))}
                    </value>
                  </div>
                </div>
              </div>
              <div className="budgetProgress">
                <div className="progressInfo">
                  <span className={`status ${status.status}`}>{status.status.toUpperCase()}</span>
                  <span className="percentage">{formatPercentage(utilization)}</span>
                </div>
                <div className="progressBar">
                  <div
                    className="progress"
                    style={{
                      width: `${Math.min(utilization, 100)}%`,
                      background: status.color,
                    }}
                  ></div>
                </div>
                {utilization >= 90 && (
                  <div className="alert">
                    ⚠️ Warning: Approaching budget limit! Consider reviewing expenses.
                  </div>
                )}
                {utilization >= 70 && utilization < 90 && (
                  <div className="warning">
                    💡 Notice: {formatPercentage(utilization)} of budget used.
                  </div>
                )}
              </div>
              <div className="budgetActions">
                <button className="actionBtn">Edit</button>
                <button className="actionBtn secondary">View Details</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Recommendations */}
      <div className="recommendations">
        <h3>Budget Recommendations</h3>
        <div className="recommendationList">
          {budgets
            .filter((b) => calculateBudgetUtilization(b.spent, b.budgetAmount) > 70)
            .map((budget) => {
              const utilization = calculateBudgetUtilization(budget.spent, budget.budgetAmount);
              const remaining = calculateRemainingBudget(budget.budgetAmount, budget.spent);

              return (
                <div key={budget.id} className="recommendationItem">
                  <div className="recommendationIcon">
                    {utilization >= 90 ? '🔴' : '🟡'}
                  </div>
                  <div className="recommendationContent">
                    <h4>{budget.department}</h4>
                    <p>
                      {utilization >= 90
                        ? `Critical: Only ${formatCurrency(
                            remaining
                          )} remaining. Consider increasing budget or reducing expenses.`
                        : `${formatPercentage(
                            utilization
                          )} of budget used. Monitor spending closely to avoid overruns.`}
                    </p>
                  </div>
                </div>
              );
            })}
          {budgets.filter((b) => calculateBudgetUtilization(b.spent, b.budgetAmount) > 70)
            .length === 0 && (
            <div className="noRecommendations">
              <p>✅ All budgets are healthy. No recommendations at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="modal" onClick={() => setShowAddModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>Add New Budget</h2>
              <button className="closeBtn" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modalBody">
              <form onSubmit={handleAddBudget}>
                <div className="formGroup">
                  <label>Department:</label>
                  <input
                    type="text"
                    value={newBudget.department}
                    onChange={(e) => setNewBudget({ ...newBudget, department: e.target.value })}
                    placeholder="e.g., Engineering, Marketing"
                    required
                  />
                </div>
                <div className="formGroup">
                  <label>Budget Amount:</label>
                  <input
                    type="number"
                    value={newBudget.budgetAmount}
                    onChange={(e) => setNewBudget({ ...newBudget, budgetAmount: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="formGroup">
                  <label>Category:</label>
                  <input
                    type="text"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    placeholder="e.g., Salaries, Tools, Infrastructure"
                    required
                  />
                </div>
                <div className="formActions">
                  <button type="submit" className="submitBtn">
                    Add Budget
                  </button>
                  <button
                    type="button"
                    className="cancelBtn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;
