import React, { useState } from 'react';
import './teamPayout.scss';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import { teamMembers, paymentHistory, payrollSchedule } from '../../data/financialData';
import {
  calculateGrossPay,
  calculateTaxDeduction,
  calculateNetPay,
  formatCurrency,
  generatePayStub,
} from '../../utils/calculations';

const TeamPayout = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('November 2024');
  const [showPayStub, setShowPayStub] = useState(false);

  const handleGeneratePayStub = (employee) => {
    setSelectedEmployee(employee);
    setShowPayStub(true);
  };

  const handlePrintPayStub = () => {
    window.print();
  };

  const teamPaymentHistory = paymentHistory.filter(p => p.type === 'Team');

  return (
    <div className="teamPayout">
      <Sidebar />
      <div className="teamPayoutContainer">
        <Navbar />
        <div className="payoutContent">
          <div className="header">
            <h1>Team Payout Dashboard</h1>
            <div className="monthSelector">
              <label>Select Period: </label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option>November 2024</option>
                <option>October 2024</option>
                <option>September 2024</option>
                <option>August 2024</option>
              </select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summaryCards">
            <div className="card">
              <div className="cardTitle">Total Team Members</div>
              <div className="cardValue">{teamMembers.length}</div>
            </div>
            <div className="card">
              <div className="cardTitle">Total Monthly Salaries</div>
              <div className="cardValue">
                {formatCurrency(teamMembers.reduce((sum, m) => sum + m.monthlySalary, 0))}
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Total Bonuses</div>
              <div className="cardValue">
                {formatCurrency(teamMembers.reduce((sum, m) => sum + (m.bonuses || 0), 0))}
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Total Payout</div>
              <div className="cardValue">
                {formatCurrency(
                  teamMembers.reduce((sum, m) => sum + m.monthlySalary + (m.bonuses || 0), 0)
                )}
              </div>
            </div>
          </div>

          {/* Employee Salary Table */}
          <div className="section">
            <h2>Monthly Salary Calculator</h2>
            <div className="tableContainer">
              <table className="payoutTable">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Base Salary</th>
                    <th>Bonuses</th>
                    <th>Gross Pay</th>
                    <th>Tax Rate</th>
                    <th>Deductions</th>
                    <th>Net Pay</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((employee) => {
                    const grossPay = calculateGrossPay(employee.monthlySalary, employee.bonuses);
                    const taxDeduction = calculateTaxDeduction(grossPay, employee.taxRate);
                    const netPay = calculateNetPay(grossPay, taxDeduction);

                    return (
                      <tr key={employee.id}>
                        <td>{employee.name}</td>
                        <td>{employee.role}</td>
                        <td>{employee.department}</td>
                        <td>{formatCurrency(employee.monthlySalary)}</td>
                        <td>{formatCurrency(employee.bonuses || 0)}</td>
                        <td className="highlight">{formatCurrency(grossPay)}</td>
                        <td>{(employee.taxRate * 100).toFixed(0)}%</td>
                        <td>{formatCurrency(taxDeduction)}</td>
                        <td className="netPay">{formatCurrency(netPay)}</td>
                        <td>
                          <button
                            className="actionBtn"
                            onClick={() => handleGeneratePayStub(employee)}
                          >
                            Generate Pay Stub
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History */}
          <div className="section">
            <h2>Payment History</h2>
            <div className="tableContainer">
              <table className="payoutTable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee</th>
                    <th>Gross Pay</th>
                    <th>Deductions</th>
                    <th>Net Pay</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPaymentHistory.slice(0, 10).map((payment) => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td>{payment.employeeName}</td>
                      <td>{formatCurrency(payment.grossPay)}</td>
                      <td>{formatCurrency(payment.deductions)}</td>
                      <td className="netPay">{formatCurrency(payment.netPay)}</td>
                      <td>{payment.paymentMethod}</td>
                      <td>
                        <span className={`status ${payment.status.toLowerCase()}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payroll Schedule */}
          <div className="section">
            <h2>Payroll Schedule</h2>
            <div className="scheduleContainer">
              {payrollSchedule
                .filter(s => s.description.includes('Team'))
                .map((schedule) => (
                  <div key={schedule.id} className="scheduleItem">
                    <div className="scheduleDate">
                      {new Date(schedule.date).toLocaleDateString()}
                    </div>
                    <div className="scheduleDetails">
                      <div className="scheduleDescription">{schedule.description}</div>
                      <div className="scheduleAmount">{formatCurrency(schedule.amount)}</div>
                    </div>
                    <div className={`scheduleStatus ${schedule.status.toLowerCase()}`}>
                      {schedule.status}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Payment Method Management */}
          <div className="section">
            <h2>Payment Methods</h2>
            <div className="tableContainer">
              <table className="payoutTable">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Payment Method</th>
                    <th>Account Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.name}</td>
                      <td>{employee.paymentMethod}</td>
                      <td>{employee.accountNumber}</td>
                      <td>
                        <button className="actionBtn secondary">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Stub Modal */}
      {showPayStub && selectedEmployee && (
        <div className="modal" onClick={() => setShowPayStub(false)}>
          <div className="modalContent payStub" onClick={(e) => e.stopPropagation()}>
            <div className="payStubHeader">
              <h2>Pay Stub</h2>
              <button className="closeBtn" onClick={() => setShowPayStub(false)}>
                ×
              </button>
            </div>
            <div className="payStubBody">
              <div className="companyInfo">
                <h3>NCE Startup Dashboard</h3>
                <p>123 Business Street, Tech City, TC 12345</p>
              </div>
              <div className="employeeInfo">
                <div className="infoRow">
                  <span>Employee Name:</span>
                  <strong>{selectedEmployee.name}</strong>
                </div>
                <div className="infoRow">
                  <span>Employee ID:</span>
                  <strong>{selectedEmployee.id}</strong>
                </div>
                <div className="infoRow">
                  <span>Department:</span>
                  <strong>{selectedEmployee.department}</strong>
                </div>
                <div className="infoRow">
                  <span>Pay Period:</span>
                  <strong>{selectedMonth}</strong>
                </div>
              </div>
              <div className="paymentDetails">
                <h4>Earnings</h4>
                <div className="detailRow">
                  <span>Base Salary:</span>
                  <span>{formatCurrency(selectedEmployee.monthlySalary)}</span>
                </div>
                <div className="detailRow">
                  <span>Bonuses:</span>
                  <span>{formatCurrency(selectedEmployee.bonuses || 0)}</span>
                </div>
                <div className="detailRow total">
                  <span>Gross Pay:</span>
                  <strong>
                    {formatCurrency(
                      calculateGrossPay(selectedEmployee.monthlySalary, selectedEmployee.bonuses)
                    )}
                  </strong>
                </div>
              </div>
              <div className="paymentDetails">
                <h4>Deductions</h4>
                <div className="detailRow">
                  <span>Income Tax ({(selectedEmployee.taxRate * 100).toFixed(0)}%):</span>
                  <span>
                    {formatCurrency(
                      calculateTaxDeduction(
                        calculateGrossPay(selectedEmployee.monthlySalary, selectedEmployee.bonuses),
                        selectedEmployee.taxRate
                      )
                    )}
                  </span>
                </div>
                <div className="detailRow total">
                  <span>Total Deductions:</span>
                  <strong>
                    {formatCurrency(
                      calculateTaxDeduction(
                        calculateGrossPay(selectedEmployee.monthlySalary, selectedEmployee.bonuses),
                        selectedEmployee.taxRate
                      )
                    )}
                  </strong>
                </div>
              </div>
              <div className="paymentDetails netPaySection">
                <div className="detailRow netPayRow">
                  <span>Net Pay:</span>
                  <strong className="netPayAmount">
                    {formatCurrency(
                      calculateNetPay(
                        calculateGrossPay(selectedEmployee.monthlySalary, selectedEmployee.bonuses),
                        calculateTaxDeduction(
                          calculateGrossPay(selectedEmployee.monthlySalary, selectedEmployee.bonuses),
                          selectedEmployee.taxRate
                        )
                      )
                    )}
                  </strong>
                </div>
              </div>
              <div className="paymentMethod">
                <div className="infoRow">
                  <span>Payment Method:</span>
                  <strong>{selectedEmployee.paymentMethod}</strong>
                </div>
                <div className="infoRow">
                  <span>Account:</span>
                  <strong>{selectedEmployee.accountNumber}</strong>
                </div>
              </div>
            </div>
            <div className="payStubFooter">
              <button className="actionBtn" onClick={handlePrintPayStub}>
                Print Pay Stub
              </button>
              <button className="actionBtn secondary" onClick={() => setShowPayStub(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPayout;
