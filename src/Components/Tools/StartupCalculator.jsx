import { useState } from 'react';
import { Link } from 'react-router-dom';
import './startupcalculator.scss';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PieChartIcon from '@mui/icons-material/PieChart';

const StartupCalculator = () => {
  const [activeCalculator, setActiveCalculator] = useState('runway');

  // Runway Calculator State
  const [runway, setRunway] = useState({
    currentCash: '',
    monthlyBurn: '',
    monthlyRevenue: ''
  });

  // Valuation Calculator State
  const [valuation, setValuation] = useState({
    revenue: '',
    growthRate: '',
    industry: 'saas'
  });

  // Equity Calculator State
  const [equity, setEquity] = useState({
    preMoney: '',
    investment: '',
    founderShares: ''
  });

  const calculateRunway = () => {
    const cash = parseFloat(runway.currentCash) || 0;
    const burn = parseFloat(runway.monthlyBurn) || 0;
    const revenue = parseFloat(runway.monthlyRevenue) || 0;
    const netBurn = burn - revenue;

    if (netBurn <= 0) {
      return 'Infinite (Revenue >= Burn Rate)';
    }

    const months = cash / netBurn;
    return `${months.toFixed(1)} months`;
  };

  const calculateValuation = () => {
    const rev = parseFloat(valuation.revenue) || 0;
    const growth = parseFloat(valuation.growthRate) || 0;

    const multipliers = {
      saas: 10,
      ecommerce: 3,
      marketplace: 8,
      fintech: 12,
      healthtech: 15,
      hardware: 2
    };

    let baseMultiple = multipliers[valuation.industry] || 5;

    // Adjust for growth rate
    if (growth > 100) baseMultiple *= 1.5;
    else if (growth > 50) baseMultiple *= 1.3;
    else if (growth > 20) baseMultiple *= 1.1;

    const estimatedValue = rev * baseMultiple;
    return `$${estimatedValue.toLocaleString()}`;
  };

  const calculateEquity = () => {
    const preMoney = parseFloat(equity.preMoney) || 0;
    const investment = parseFloat(equity.investment) || 0;
    const founderShares = parseFloat(equity.founderShares) || 100;

    const postMoney = preMoney + investment;
    const investorOwnership = (investment / postMoney) * 100;
    const newFounderOwnership = founderShares * (1 - investorOwnership / 100);
    const dilution = founderShares - newFounderOwnership;

    return {
      postMoney: `$${postMoney.toLocaleString()}`,
      investorOwnership: `${investorOwnership.toFixed(2)}%`,
      newFounderOwnership: `${newFounderOwnership.toFixed(2)}%`,
      dilution: `${dilution.toFixed(2)}%`
    };
  };

  const equityResults = calculateEquity();

  return (
    <div className="startupCalculator">
      <Sidebar />
      <div className="calculatorContainer">
        <Navbar />
        <div className="calculatorContent">
          <div className="header">
            <Link to="/resources" className="backButton">
              <ArrowBackIcon /> Back to Resources
            </Link>
            <h1>
              <CalculateIcon className="titleIcon" />
              Startup Calculator Suite
            </h1>
            <p>Essential calculators for startup financial planning</p>
          </div>

          <div className="calculatorTabs">
            <button
              className={activeCalculator === 'runway' ? 'active' : ''}
              onClick={() => setActiveCalculator('runway')}
            >
              <TrendingUpIcon /> Runway Calculator
            </button>
            <button
              className={activeCalculator === 'valuation' ? 'active' : ''}
              onClick={() => setActiveCalculator('valuation')}
            >
              <AccountBalanceIcon /> Valuation Estimator
            </button>
            <button
              className={activeCalculator === 'equity' ? 'active' : ''}
              onClick={() => setActiveCalculator('equity')}
            >
              <PieChartIcon /> Equity & Dilution
            </button>
          </div>

          {activeCalculator === 'runway' && (
            <div className="calculator runwayCalc">
              <div className="calcLeft">
                <h2>Runway Calculator</h2>
                <p className="description">
                  Calculate how long your startup can operate with current cash reserves
                </p>

                <div className="formGroup">
                  <label>Current Cash Balance ($)</label>
                  <input
                    type="number"
                    placeholder="e.g., 500000"
                    value={runway.currentCash}
                    onChange={(e) => setRunway({ ...runway, currentCash: e.target.value })}
                  />
                </div>

                <div className="formGroup">
                  <label>Monthly Burn Rate ($)</label>
                  <input
                    type="number"
                    placeholder="e.g., 50000"
                    value={runway.monthlyBurn}
                    onChange={(e) => setRunway({ ...runway, monthlyBurn: e.target.value })}
                  />
                  <small>Total monthly expenses</small>
                </div>

                <div className="formGroup">
                  <label>Monthly Revenue ($)</label>
                  <input
                    type="number"
                    placeholder="e.g., 10000"
                    value={runway.monthlyRevenue}
                    onChange={(e) => setRunway({ ...runway, monthlyRevenue: e.target.value })}
                  />
                  <small>Current monthly recurring revenue</small>
                </div>
              </div>

              <div className="calcRight">
                <div className="resultCard">
                  <h3>Your Runway</h3>
                  <div className="resultValue">{calculateRunway()}</div>
                  <div className="resultDetails">
                    <div className="detailItem">
                      <span>Net Burn Rate:</span>
                      <span className="value">
                        ${((parseFloat(runway.monthlyBurn) || 0) - (parseFloat(runway.monthlyRevenue) || 0)).toLocaleString()}/month
                      </span>
                    </div>
                    <div className="detailItem">
                      <span>Recommended Action:</span>
                      <span className="value">
                        {parseFloat(calculateRunway()) < 6
                          ? 'Start fundraising immediately'
                          : parseFloat(calculateRunway()) < 12
                          ? 'Begin fundraising conversations'
                          : 'Continue monitoring closely'}
                      </span>
                    </div>
                  </div>
                  <div className="tip">
                    <strong>Tip:</strong> Aim to start fundraising when you have 6-9 months of runway remaining.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCalculator === 'valuation' && (
            <div className="calculator valuationCalc">
              <div className="calcLeft">
                <h2>Valuation Estimator</h2>
                <p className="description">
                  Get a rough estimate of your startup's valuation based on revenue and industry
                </p>

                <div className="formGroup">
                  <label>Annual Revenue ($)</label>
                  <input
                    type="number"
                    placeholder="e.g., 1000000"
                    value={valuation.revenue}
                    onChange={(e) => setValuation({ ...valuation, revenue: e.target.value })}
                  />
                </div>

                <div className="formGroup">
                  <label>Year-over-Year Growth Rate (%)</label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={valuation.growthRate}
                    onChange={(e) => setValuation({ ...valuation, growthRate: e.target.value })}
                  />
                </div>

                <div className="formGroup">
                  <label>Industry</label>
                  <select
                    value={valuation.industry}
                    onChange={(e) => setValuation({ ...valuation, industry: e.target.value })}
                  >
                    <option value="saas">SaaS (10x revenue)</option>
                    <option value="ecommerce">E-commerce (3x revenue)</option>
                    <option value="marketplace">Marketplace (8x revenue)</option>
                    <option value="fintech">FinTech (12x revenue)</option>
                    <option value="healthtech">HealthTech (15x revenue)</option>
                    <option value="hardware">Hardware (2x revenue)</option>
                  </select>
                  <small>Different industries have different typical multiples</small>
                </div>
              </div>

              <div className="calcRight">
                <div className="resultCard">
                  <h3>Estimated Valuation</h3>
                  <div className="resultValue">{calculateValuation()}</div>
                  <div className="resultDetails">
                    <div className="detailItem">
                      <span>Base Multiple:</span>
                      <span className="value">{valuation.industry === 'saas' ? '10x' : valuation.industry === 'ecommerce' ? '3x' : valuation.industry === 'marketplace' ? '8x' : valuation.industry === 'fintech' ? '12x' : valuation.industry === 'healthtech' ? '15x' : '2x'}</span>
                    </div>
                    <div className="detailItem">
                      <span>Growth Adjustment:</span>
                      <span className="value">
                        {parseFloat(valuation.growthRate) > 100
                          ? '+50%'
                          : parseFloat(valuation.growthRate) > 50
                          ? '+30%'
                          : parseFloat(valuation.growthRate) > 20
                          ? '+10%'
                          : 'None'}
                      </span>
                    </div>
                  </div>
                  <div className="tip">
                    <strong>Note:</strong> This is a rough estimate. Actual valuations depend on many factors including market conditions, team, traction, and investor interest.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCalculator === 'equity' && (
            <div className="calculator equityCalc">
              <div className="calcLeft">
                <h2>Equity & Dilution Calculator</h2>
                <p className="description">
                  Calculate how investment will dilute your ownership
                </p>

                <div className="formGroup">
                  <label>Pre-Money Valuation ($)</label>
                  <input
                    type="number"
                    placeholder="e.g., 4000000"
                    value={equity.preMoney}
                    onChange={(e) => setEquity({ ...equity, preMoney: e.target.value })}
                  />
                  <small>Company value before investment</small>
                </div>

                <div className="formGroup">
                  <label>Investment Amount ($)</label>
                  <input
                    type="number"
                    placeholder="e.g., 1000000"
                    value={equity.investment}
                    onChange={(e) => setEquity({ ...equity, investment: e.target.value })}
                  />
                </div>

                <div className="formGroup">
                  <label>Current Founder Ownership (%)</label>
                  <input
                    type="number"
                    placeholder="e.g., 100"
                    value={equity.founderShares}
                    onChange={(e) => setEquity({ ...equity, founderShares: e.target.value })}
                  />
                  <small>Your ownership before this round</small>
                </div>
              </div>

              <div className="calcRight">
                <div className="resultCard">
                  <h3>After Investment</h3>
                  <div className="resultGrid">
                    <div className="resultItem">
                      <span className="label">Post-Money Valuation</span>
                      <span className="value big">{equityResults.postMoney}</span>
                    </div>
                    <div className="resultItem">
                      <span className="label">Investor Ownership</span>
                      <span className="value big">{equityResults.investorOwnership}</span>
                    </div>
                    <div className="resultItem">
                      <span className="label">Your New Ownership</span>
                      <span className="value big">{equityResults.newFounderOwnership}</span>
                    </div>
                    <div className="resultItem">
                      <span className="label">Your Dilution</span>
                      <span className="value big negative">{equityResults.dilution}</span>
                    </div>
                  </div>
                  <div className="tip">
                    <strong>Tip:</strong> Dilution is normal and healthy. Focus on growing the overall pie, not just your slice.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupCalculator;
