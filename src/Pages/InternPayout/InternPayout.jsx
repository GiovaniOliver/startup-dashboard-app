import React, { useState } from 'react';
import './internPayout.scss';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import { interns, paymentHistory, reimbursements } from '../../data/financialData';
import {
  calculateInternStipend,
  calculateDaysBetween,
  formatCurrency,
} from '../../utils/calculations';

const InternPayout = () => {
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [newReimbursement, setNewReimbursement] = useState({
    description: '',
    amount: '',
  });

  const handleViewDetails = (intern) => {
    setSelectedIntern(intern);
    setShowDetails(true);
  };

  const internPaymentHistory = paymentHistory.filter(p => p.type === 'Intern');

  const getTotalStipend = (intern) => {
    return calculateInternStipend(intern.stipendPerDay, intern.daysWorked);
  };

  const getInternshipDuration = (intern) => {
    return calculateDaysBetween(intern.startDate, intern.endDate);
  };

  const getRemainingDays = (intern) => {
    const today = new Date();
    const endDate = new Date(intern.endDate);
    if (endDate < today) return 0;
    return calculateDaysBetween(new Date().toISOString(), intern.endDate);
  };

  return (
    <div className="internPayout">
      <Sidebar />
      <div className="internPayoutContainer">
        <Navbar />
        <div className="payoutContent">
          <div className="header">
            <h1>Intern Payout Dashboard</h1>
          </div>

          {/* Summary Cards */}
          <div className="summaryCards">
            <div className="card">
              <div className="cardTitle">Total Interns</div>
              <div className="cardValue">{interns.length}</div>
            </div>
            <div className="card">
              <div className="cardTitle">Monthly Stipends</div>
              <div className="cardValue">
                {formatCurrency(interns.reduce((sum, i) => sum + getTotalStipend(i), 0))}
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Total Days Worked</div>
              <div className="cardValue">
                {interns.reduce((sum, i) => sum + i.daysWorked, 0)}
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Pending Reimbursements</div>
              <div className="cardValue">
                {reimbursements.filter(r => r.status === 'Pending').length}
              </div>
            </div>
          </div>

          {/* Intern Stipend Calculator */}
          <div className="section">
            <h2>Stipend Calculator</h2>
            <div className="tableContainer">
              <table className="payoutTable">
                <thead>
                  <tr>
                    <th>Intern Name</th>
                    <th>Department</th>
                    <th>Supervisor</th>
                    <th>Daily Stipend</th>
                    <th>Hours/Day</th>
                    <th>Days Worked</th>
                    <th>Total Stipend</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interns.map((intern) => (
                    <tr key={intern.id}>
                      <td>{intern.name}</td>
                      <td>{intern.department}</td>
                      <td>{intern.supervisor}</td>
                      <td>{formatCurrency(intern.stipendPerDay)}</td>
                      <td>{intern.hoursPerDay}h</td>
                      <td>{intern.daysWorked}</td>
                      <td className="highlight">{formatCurrency(getTotalStipend(intern))}</td>
                      <td>
                        {new Date(intern.startDate).toLocaleDateString()} -{' '}
                        {new Date(intern.endDate).toLocaleDateString()}
                      </td>
                      <td>
                        <button className="actionBtn" onClick={() => handleViewDetails(intern)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Internship Duration Tracker */}
          <div className="section">
            <h2>Internship Duration Tracker</h2>
            <div className="durationContainer">
              {interns.map((intern) => {
                const totalDays = getInternshipDuration(intern);
                const remainingDays = getRemainingDays(intern);
                const progress = ((totalDays - remainingDays) / totalDays) * 100;

                return (
                  <div key={intern.id} className="durationItem">
                    <div className="internInfo">
                      <div className="internName">{intern.name}</div>
                      <div className="internUniversity">{intern.university}</div>
                    </div>
                    <div className="durationBar">
                      <div className="progressBar">
                        <div className="progress" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="durationStats">
                        <span>Total: {totalDays} days</span>
                        <span>Remaining: {remainingDays} days</span>
                        <span>{progress.toFixed(0)}% Complete</span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    <th>Intern Name</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {internPaymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td>{payment.employeeName}</td>
                      <td className="highlight">{formatCurrency(payment.amount)}</td>
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

          {/* Reimbursement Tracking */}
          <div className="section">
            <h2>Reimbursement Tracking</h2>
            <div className="tableContainer">
              <table className="payoutTable">
                <thead>
                  <tr>
                    <th>Intern Name</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {reimbursements.map((reimbursement) => (
                    <tr key={reimbursement.id}>
                      <td>{reimbursement.internName}</td>
                      <td>{reimbursement.description}</td>
                      <td>{formatCurrency(reimbursement.amount)}</td>
                      <td>{new Date(reimbursement.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${reimbursement.status.toLowerCase()}`}>
                          {reimbursement.status}
                        </span>
                      </td>
                      <td>
                        <button className="actionBtn secondary">View Receipt</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="reimbursementForm">
              <h3>Submit New Reimbursement</h3>
              <form>
                <div className="formGroup">
                  <label>Intern:</label>
                  <select>
                    <option value="">Select Intern</option>
                    {interns.map(intern => (
                      <option key={intern.id} value={intern.id}>{intern.name}</option>
                    ))}
                  </select>
                </div>
                <div className="formGroup">
                  <label>Description:</label>
                  <input
                    type="text"
                    placeholder="e.g., Travel expenses, Software license"
                    value={newReimbursement.description}
                    onChange={(e) =>
                      setNewReimbursement({ ...newReimbursement, description: e.target.value })
                    }
                  />
                </div>
                <div className="formGroup">
                  <label>Amount:</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newReimbursement.amount}
                    onChange={(e) =>
                      setNewReimbursement({ ...newReimbursement, amount: e.target.value })
                    }
                  />
                </div>
                <div className="formGroup">
                  <label>Receipt:</label>
                  <input type="file" accept=".pdf,.jpg,.png" />
                </div>
                <button type="submit" className="actionBtn">
                  Submit Reimbursement
                </button>
              </form>
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="section">
            <h2>Payment Schedule</h2>
            <div className="scheduleGrid">
              {interns.map((intern) => (
                <div key={intern.id} className="scheduleCard">
                  <div className="scheduleHeader">
                    <h4>{intern.name}</h4>
                    <div className="scheduleBadge">{intern.department}</div>
                  </div>
                  <div className="scheduleBody">
                    <div className="scheduleRow">
                      <span>Next Payment:</span>
                      <strong>Nov 30, 2024</strong>
                    </div>
                    <div className="scheduleRow">
                      <span>Amount:</span>
                      <strong className="amount">{formatCurrency(getTotalStipend(intern))}</strong>
                    </div>
                    <div className="scheduleRow">
                      <span>Frequency:</span>
                      <strong>Monthly</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Intern Details Modal */}
      {showDetails && selectedIntern && (
        <div className="modal" onClick={() => setShowDetails(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>Intern Details - {selectedIntern.name}</h2>
              <button className="closeBtn" onClick={() => setShowDetails(false)}>
                ×
              </button>
            </div>
            <div className="modalBody">
              <div className="detailsGrid">
                <div className="detailItem">
                  <label>Name:</label>
                  <value>{selectedIntern.name}</value>
                </div>
                <div className="detailItem">
                  <label>Department:</label>
                  <value>{selectedIntern.department}</value>
                </div>
                <div className="detailItem">
                  <label>University:</label>
                  <value>{selectedIntern.university}</value>
                </div>
                <div className="detailItem">
                  <label>Supervisor:</label>
                  <value>{selectedIntern.supervisor}</value>
                </div>
                <div className="detailItem">
                  <label>Start Date:</label>
                  <value>{new Date(selectedIntern.startDate).toLocaleDateString()}</value>
                </div>
                <div className="detailItem">
                  <label>End Date:</label>
                  <value>{new Date(selectedIntern.endDate).toLocaleDateString()}</value>
                </div>
                <div className="detailItem">
                  <label>Daily Stipend:</label>
                  <value>{formatCurrency(selectedIntern.stipendPerDay)}</value>
                </div>
                <div className="detailItem">
                  <label>Hours per Day:</label>
                  <value>{selectedIntern.hoursPerDay} hours</value>
                </div>
                <div className="detailItem">
                  <label>Days Worked:</label>
                  <value>{selectedIntern.daysWorked} days</value>
                </div>
                <div className="detailItem">
                  <label>Total Duration:</label>
                  <value>{getInternshipDuration(selectedIntern)} days</value>
                </div>
                <div className="detailItem">
                  <label>Remaining Days:</label>
                  <value>{getRemainingDays(selectedIntern)} days</value>
                </div>
                <div className="detailItem highlight">
                  <label>Total Stipend:</label>
                  <value className="amount">{formatCurrency(getTotalStipend(selectedIntern))}</value>
                </div>
              </div>
            </div>
            <div className="modalFooter">
              <button className="actionBtn secondary" onClick={() => setShowDetails(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternPayout;
