import React, { useState } from 'react';
import './financialReport.scss';
import {
  teamMembers,
  interns,
  paymentHistory,
  monthlySpendingTrend,
  expenseCategories,
} from '../../data/financialData';
import {
  calculateTotalTeamSalaries,
  calculateTotalInternStipends,
  formatCurrency,
  calculateYTD,
} from '../../utils/calculations';

const FinancialReport = () => {
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('November 2024');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 2024');
  const [selectedYear, setSelectedYear] = useState('2024');

  const totalTeamSalaries = calculateTotalTeamSalaries(teamMembers);
  const totalInternStipends = calculateTotalInternStipends(interns);
  const totalTaskCosts = 8000;
  const totalMonthly = totalTeamSalaries + totalInternStipends + totalTaskCosts;
  const ytdData = calculateYTD(monthlySpendingTrend);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // CSV export logic
    const csvData = [
      ['Category', 'Amount', 'Percentage'],
      ...expenseCategories.map((cat) => [cat.name, cat.amount, `${cat.percentage}%`]),
    ];
    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'monthly':
        return `Monthly Financial Report - ${selectedMonth}`;
      case 'quarterly':
        return `Quarterly Financial Report - ${selectedQuarter}`;
      case 'yearly':
        return `Annual Financial Report - ${selectedYear}`;
      default:
        return 'Financial Report';
    }
  };

  return (
    <div className="financialReport">
      <div className="reportHeader">
        <div className="reportControls">
          <div className="controlGroup">
            <label>Report Type:</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          {reportType === 'monthly' && (
            <div className="controlGroup">
              <label>Month:</label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option>November 2024</option>
                <option>October 2024</option>
                <option>September 2024</option>
              </select>
            </div>
          )}
          {reportType === 'quarterly' && (
            <div className="controlGroup">
              <label>Quarter:</label>
              <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
                <option>Q4 2024</option>
                <option>Q3 2024</option>
                <option>Q2 2024</option>
                <option>Q1 2024</option>
              </select>
            </div>
          )}
          {reportType === 'yearly' && (
            <div className="controlGroup">
              <label>Year:</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
          )}
        </div>
        <div className="exportButtons">
          <button className="exportBtn pdf" onClick={handleExportPDF}>
            📄 Export PDF
          </button>
          <button className="exportBtn csv" onClick={handleExportCSV}>
            📊 Export CSV
          </button>
        </div>
      </div>

      <div className="reportContent">
        <div className="reportTitleSection">
          <h1>{getReportTitle()}</h1>
          <div className="reportMeta">
            <span>Generated: {new Date().toLocaleDateString()}</span>
            <span>NCE Startup Dashboard</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="reportSection">
          <h2>Executive Summary</h2>
          <div className="summaryGrid">
            <div className="summaryItem">
              <label>Total Revenue:</label>
              <value className="revenue">{formatCurrency(150000)}</value>
            </div>
            <div className="summaryItem">
              <label>Total Expenses:</label>
              <value className="expense">{formatCurrency(totalMonthly)}</value>
            </div>
            <div className="summaryItem">
              <label>Net Income:</label>
              <value className="net">{formatCurrency(150000 - totalMonthly)}</value>
            </div>
            <div className="summaryItem">
              <label>Profit Margin:</label>
              <value className="margin">
                {(((150000 - totalMonthly) / 150000) * 100).toFixed(2)}%
              </value>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="reportSection">
          <h2>Expense Categorization</h2>
          <table className="reportTable">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expenseCategories.map((category) => (
                <tr key={category.name}>
                  <td>{category.name}</td>
                  <td>{formatCurrency(category.amount)}</td>
                  <td>{category.percentage}%</td>
                  <td>
                    <div className="progressBar">
                      <div
                        className="progress"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="totalRow">
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>
                    {formatCurrency(expenseCategories.reduce((sum, c) => sum + c.amount, 0))}
                  </strong>
                </td>
                <td>
                  <strong>100%</strong>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Department Expenses */}
        <div className="reportSection">
          <h2>Department Breakdown</h2>
          <div className="departmentGrid">
            <div className="departmentCard">
              <h3>Engineering</h3>
              <div className="departmentStat">
                <label>Team Salaries:</label>
                <value>{formatCurrency(13500)}</value>
              </div>
              <div className="departmentStat">
                <label>Intern Stipends:</label>
                <value>{formatCurrency(1000)}</value>
              </div>
              <div className="departmentStat total">
                <label>Total:</label>
                <value>{formatCurrency(14500)}</value>
              </div>
            </div>
            <div className="departmentCard">
              <h3>Design</h3>
              <div className="departmentStat">
                <label>Team Salaries:</label>
                <value>{formatCurrency(6500)}</value>
              </div>
              <div className="departmentStat">
                <label>Intern Stipends:</label>
                <value>{formatCurrency(810)}</value>
              </div>
              <div className="departmentStat total">
                <label>Total:</label>
                <value>{formatCurrency(7310)}</value>
              </div>
            </div>
            <div className="departmentCard">
              <h3>Marketing</h3>
              <div className="departmentStat">
                <label>Team Salaries:</label>
                <value>{formatCurrency(7000)}</value>
              </div>
              <div className="departmentStat">
                <label>Intern Stipends:</label>
                <value>{formatCurrency(880)}</value>
              </div>
              <div className="departmentStat total">
                <label>Total:</label>
                <value>{formatCurrency(7880)}</value>
              </div>
            </div>
            <div className="departmentCard">
              <h3>Product</h3>
              <div className="departmentStat">
                <label>Team Salaries:</label>
                <value>{formatCurrency(7500)}</value>
              </div>
              <div className="departmentStat">
                <label>Intern Stipends:</label>
                <value>{formatCurrency(0)}</value>
              </div>
              <div className="departmentStat total">
                <label>Total:</label>
                <value>{formatCurrency(7500)}</value>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="reportSection">
          <h2>Payment Summary</h2>
          <table className="reportTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payee</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.slice(0, 10).map((payment) => (
                <tr key={payment.id}>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                  <td>{payment.employeeName}</td>
                  <td>{payment.type}</td>
                  <td>{formatCurrency(payment.netPay)}</td>
                  <td>
                    <span className={`badge ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Profit/Loss Projection */}
        <div className="reportSection">
          <h2>Profit & Loss Statement</h2>
          <div className="plStatement">
            <div className="plSection revenue">
              <h4>Revenue</h4>
              <div className="plItem">
                <span>Product Sales</span>
                <span>{formatCurrency(100000)}</span>
              </div>
              <div className="plItem">
                <span>Service Revenue</span>
                <span>{formatCurrency(40000)}</span>
              </div>
              <div className="plItem">
                <span>Other Income</span>
                <span>{formatCurrency(10000)}</span>
              </div>
              <div className="plItem total">
                <strong>Total Revenue</strong>
                <strong>{formatCurrency(150000)}</strong>
              </div>
            </div>

            <div className="plSection expenses">
              <h4>Expenses</h4>
              <div className="plItem">
                <span>Team Salaries</span>
                <span>{formatCurrency(totalTeamSalaries)}</span>
              </div>
              <div className="plItem">
                <span>Intern Stipends</span>
                <span>{formatCurrency(totalInternStipends)}</span>
              </div>
              <div className="plItem">
                <span>Task Costs</span>
                <span>{formatCurrency(totalTaskCosts)}</span>
              </div>
              <div className="plItem">
                <span>Infrastructure</span>
                <span>{formatCurrency(10000)}</span>
              </div>
              <div className="plItem">
                <span>Marketing</span>
                <span>{formatCurrency(8000)}</span>
              </div>
              <div className="plItem">
                <span>Other Expenses</span>
                <span>{formatCurrency(6000)}</span>
              </div>
              <div className="plItem total">
                <strong>Total Expenses</strong>
                <strong>{formatCurrency(totalMonthly + 24000)}</strong>
              </div>
            </div>

            <div className="plSection netIncome">
              <div className="plItem">
                <strong>Net Income</strong>
                <strong className="profit">{formatCurrency(150000 - (totalMonthly + 24000))}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* YTD Comparison */}
        {reportType === 'yearly' && (
          <div className="reportSection">
            <h2>Year-to-Date Summary</h2>
            <div className="ytdGrid">
              <div className="ytdItem">
                <label>Team Salaries YTD:</label>
                <value>{formatCurrency(ytdData.teamSalary)}</value>
              </div>
              <div className="ytdItem">
                <label>Intern Stipends YTD:</label>
                <value>{formatCurrency(ytdData.internStipend)}</value>
              </div>
              <div className="ytdItem">
                <label>Task Costs YTD:</label>
                <value>{formatCurrency(ytdData.tasks)}</value>
              </div>
              <div className="ytdItem highlight">
                <label>Total Expenses YTD:</label>
                <value>{formatCurrency(ytdData.total)}</value>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="reportFooter">
          <p>
            This report is generated automatically by the NCE Startup Dashboard financial management
            system.
          </p>
          <p>For questions or concerns, please contact the finance department.</p>
          <p className="timestamp">
            Report generated on {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
