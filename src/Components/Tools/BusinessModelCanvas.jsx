import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './businessmodelcanvas.scss';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';

const BusinessModelCanvas = () => {
  const [canvas, setCanvas] = useState({
    keyPartners: '',
    keyActivities: '',
    keyResources: '',
    valuePropositions: '',
    customerRelationships: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: ''
  });

  useEffect(() => {
    // Load saved canvas from localStorage
    const savedCanvas = localStorage.getItem('businessModelCanvas');
    if (savedCanvas) {
      setCanvas(JSON.parse(savedCanvas));
    }
  }, []);

  const handleChange = (field, value) => {
    setCanvas({
      ...canvas,
      [field]: value
    });
  };

  const handleSave = () => {
    localStorage.setItem('businessModelCanvas', JSON.stringify(canvas));
    alert('Business Model Canvas saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the canvas? This will clear all your inputs.')) {
      setCanvas({
        keyPartners: '',
        keyActivities: '',
        keyResources: '',
        valuePropositions: '',
        customerRelationships: '',
        channels: '',
        customerSegments: '',
        costStructure: '',
        revenueStreams: ''
      });
      localStorage.removeItem('businessModelCanvas');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(canvas, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'business-model-canvas.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="businessModelCanvas">
      <Sidebar />
      <div className="canvasContainer">
        <Navbar />
        <div className="canvasContent">
          <div className="header">
            <Link to="/resources" className="backButton">
              <ArrowBackIcon /> Back to Resources
            </Link>
            <h1>Business Model Canvas</h1>
            <p>Design and visualize your business model using the proven framework</p>
          </div>

          <div className="canvasActions">
            <button className="actionButton save" onClick={handleSave}>
              <SaveIcon /> Save Canvas
            </button>
            <button className="actionButton export" onClick={handleExport}>
              <DownloadIcon /> Export JSON
            </button>
            <button className="actionButton reset" onClick={handleReset}>
              <RefreshIcon /> Reset
            </button>
          </div>

          <div className="canvasGrid">
            <div className="canvasBlock keyPartners">
              <div className="blockHeader">
                <h3>Key Partners</h3>
                <InfoIcon className="infoIcon" title="Who are your key partners and suppliers?" />
              </div>
              <textarea
                placeholder="List your key partners, suppliers, and strategic alliances..."
                value={canvas.keyPartners}
                onChange={(e) => handleChange('keyPartners', e.target.value)}
              />
            </div>

            <div className="canvasBlock keyActivities">
              <div className="blockHeader">
                <h3>Key Activities</h3>
                <InfoIcon className="infoIcon" title="What key activities does your value proposition require?" />
              </div>
              <textarea
                placeholder="Describe the most important activities your business must perform..."
                value={canvas.keyActivities}
                onChange={(e) => handleChange('keyActivities', e.target.value)}
              />
            </div>

            <div className="canvasBlock valuePropositions">
              <div className="blockHeader">
                <h3>Value Propositions</h3>
                <InfoIcon className="infoIcon" title="What value do you deliver to the customer?" />
              </div>
              <textarea
                placeholder="Describe the bundle of products and services that create value for your customers..."
                value={canvas.valuePropositions}
                onChange={(e) => handleChange('valuePropositions', e.target.value)}
              />
            </div>

            <div className="canvasBlock customerRelationships">
              <div className="blockHeader">
                <h3>Customer Relationships</h3>
                <InfoIcon className="infoIcon" title="What type of relationship do you establish with your customers?" />
              </div>
              <textarea
                placeholder="Describe how you get, keep, and grow customers..."
                value={canvas.customerRelationships}
                onChange={(e) => handleChange('customerRelationships', e.target.value)}
              />
            </div>

            <div className="canvasBlock customerSegments">
              <div className="blockHeader">
                <h3>Customer Segments</h3>
                <InfoIcon className="infoIcon" title="For whom are you creating value?" />
              </div>
              <textarea
                placeholder="Define the different groups of people or organizations you aim to reach and serve..."
                value={canvas.customerSegments}
                onChange={(e) => handleChange('customerSegments', e.target.value)}
              />
            </div>

            <div className="canvasBlock keyResources">
              <div className="blockHeader">
                <h3>Key Resources</h3>
                <InfoIcon className="infoIcon" title="What key resources does your value proposition require?" />
              </div>
              <textarea
                placeholder="List the most important assets required to make your business model work..."
                value={canvas.keyResources}
                onChange={(e) => handleChange('keyResources', e.target.value)}
              />
            </div>

            <div className="canvasBlock channels">
              <div className="blockHeader">
                <h3>Channels</h3>
                <InfoIcon className="infoIcon" title="Through which channels do you reach your customers?" />
              </div>
              <textarea
                placeholder="Describe how you communicate with and reach your customer segments..."
                value={canvas.channels}
                onChange={(e) => handleChange('channels', e.target.value)}
              />
            </div>

            <div className="canvasBlock costStructure">
              <div className="blockHeader">
                <h3>Cost Structure</h3>
                <InfoIcon className="infoIcon" title="What are the most important costs in your business model?" />
              </div>
              <textarea
                placeholder="Describe all costs incurred to operate your business model..."
                value={canvas.costStructure}
                onChange={(e) => handleChange('costStructure', e.target.value)}
              />
            </div>

            <div className="canvasBlock revenueStreams">
              <div className="blockHeader">
                <h3>Revenue Streams</h3>
                <InfoIcon className="infoIcon" title="For what value are your customers willing to pay?" />
              </div>
              <textarea
                placeholder="Describe how your business generates cash from each customer segment..."
                value={canvas.revenueStreams}
                onChange={(e) => handleChange('revenueStreams', e.target.value)}
              />
            </div>
          </div>

          <div className="tips">
            <h3>Tips for Completing Your Business Model Canvas:</h3>
            <ul>
              <li>Start with Customer Segments - understanding who you serve is crucial</li>
              <li>Define your Value Propositions clearly - what makes you unique?</li>
              <li>Be specific about your Revenue Streams - how exactly will you make money?</li>
              <li>Consider all Cost Structure elements - don't underestimate your expenses</li>
              <li>Review and iterate regularly - your business model will evolve</li>
              <li>Save your work frequently using the Save button above</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessModelCanvas;
