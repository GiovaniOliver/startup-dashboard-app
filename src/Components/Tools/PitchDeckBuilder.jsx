import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './pitchdeckbuilder.scss';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PresentationIcon from '@mui/icons-material/Slideshow';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const PitchDeckBuilder = () => {
  const slides = [
    {
      id: 1,
      title: 'Company Name & Tagline',
      description: 'Your company name and a compelling one-liner',
      fields: ['companyName', 'tagline']
    },
    {
      id: 2,
      title: 'Problem',
      description: 'What problem are you solving?',
      fields: ['problem', 'problemImpact']
    },
    {
      id: 3,
      title: 'Solution',
      description: 'How does your product solve this problem?',
      fields: ['solution', 'uniqueApproach']
    },
    {
      id: 4,
      title: 'Market Opportunity',
      description: 'How big is the market?',
      fields: ['tam', 'sam', 'som']
    },
    {
      id: 5,
      title: 'Product Demo',
      description: 'Show your product in action',
      fields: ['productDescription', 'keyFeatures']
    },
    {
      id: 6,
      title: 'Business Model',
      description: 'How do you make money?',
      fields: ['revenueModel', 'pricing']
    },
    {
      id: 7,
      title: 'Traction',
      description: 'Prove your progress',
      fields: ['metrics', 'milestones']
    },
    {
      id: 8,
      title: 'Competition',
      description: 'Who are your competitors and what makes you different?',
      fields: ['competitors', 'advantage']
    },
    {
      id: 9,
      title: 'Team',
      description: 'Who is building this?',
      fields: ['founders', 'advisors']
    },
    {
      id: 10,
      title: 'Financials',
      description: 'Revenue projections and key metrics',
      fields: ['revenue', 'expenses', 'projections']
    },
    {
      id: 11,
      title: 'The Ask',
      description: 'How much are you raising and what will you do with it?',
      fields: ['askAmount', 'useOfFunds']
    },
    {
      id: 12,
      title: 'Contact',
      description: 'How can investors reach you?',
      fields: ['email', 'phone', 'website']
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [pitchDeck, setPitchDeck] = useState({
    companyName: '',
    tagline: '',
    problem: '',
    problemImpact: '',
    solution: '',
    uniqueApproach: '',
    tam: '',
    sam: '',
    som: '',
    productDescription: '',
    keyFeatures: '',
    revenueModel: '',
    pricing: '',
    metrics: '',
    milestones: '',
    competitors: '',
    advantage: '',
    founders: '',
    advisors: '',
    revenue: '',
    expenses: '',
    projections: '',
    askAmount: '',
    useOfFunds: '',
    email: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('pitchDeck');
    if (saved) {
      setPitchDeck(JSON.parse(saved));
    }
  }, []);

  const handleChange = (field, value) => {
    setPitchDeck({
      ...pitchDeck,
      [field]: value
    });
  };

  const handleSave = () => {
    localStorage.setItem('pitchDeck', JSON.stringify(pitchDeck));
    alert('Pitch deck saved successfully!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(pitchDeck, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'pitch-deck.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const isSlideComplete = (slideIndex) => {
    const slide = slides[slideIndex];
    return slide.fields.every(field => pitchDeck[field] && pitchDeck[field].trim() !== '');
  };

  const completedSlides = slides.filter((_, index) => isSlideComplete(index)).length;
  const progress = (completedSlides / slides.length) * 100;

  const goToNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  const fieldLabels = {
    companyName: 'Company Name',
    tagline: 'Tagline / One-liner',
    problem: 'Problem Description',
    problemImpact: 'Problem Impact',
    solution: 'Your Solution',
    uniqueApproach: 'What Makes It Unique',
    tam: 'TAM (Total Addressable Market)',
    sam: 'SAM (Serviceable Addressable Market)',
    som: 'SOM (Serviceable Obtainable Market)',
    productDescription: 'Product Description',
    keyFeatures: 'Key Features',
    revenueModel: 'Revenue Model',
    pricing: 'Pricing Strategy',
    metrics: 'Key Metrics',
    milestones: 'Major Milestones',
    competitors: 'Main Competitors',
    advantage: 'Competitive Advantage',
    founders: 'Founders & Key Team',
    advisors: 'Advisors',
    revenue: 'Current/Projected Revenue',
    expenses: 'Major Expenses',
    projections: '3-Year Projections',
    askAmount: 'Amount Raising',
    useOfFunds: 'Use of Funds',
    email: 'Email',
    phone: 'Phone',
    website: 'Website'
  };

  const fieldPlaceholders = {
    companyName: 'e.g., Acme Inc.',
    tagline: 'e.g., Making AI accessible to everyone',
    problem: 'Describe the problem your target customers face...',
    problemImpact: 'How does this problem affect your customers? Quantify if possible...',
    solution: 'Explain how your product solves the problem...',
    uniqueApproach: 'What makes your solution different from existing alternatives?',
    tam: 'e.g., $50B - The total market size',
    sam: 'e.g., $10B - The portion you can realistically serve',
    som: 'e.g., $500M - The portion you can capture in 3-5 years',
    productDescription: 'Describe your product and how it works...',
    keyFeatures: 'List your top 3-5 features...',
    revenueModel: 'e.g., SaaS subscription, marketplace commission, etc.',
    pricing: 'Describe your pricing tiers and strategy...',
    metrics: 'e.g., MRR, users, growth rate, retention...',
    milestones: 'List major achievements and upcoming goals...',
    competitors: 'List your main competitors...',
    advantage: 'Explain why customers will choose you over competitors...',
    founders: 'Brief background of founders and key team members...',
    advisors: 'List notable advisors and their credentials...',
    revenue: 'Current revenue and projections...',
    expenses: 'Major cost categories...',
    projections: 'Year 1, Year 2, Year 3 revenue and expenses...',
    askAmount: 'e.g., $1.5M seed round',
    useOfFunds: 'Breakdown of how you\'ll use the investment...',
    email: 'founder@company.com',
    phone: '+1 (555) 123-4567',
    website: 'www.company.com'
  };

  return (
    <div className="pitchDeckBuilder">
      <Sidebar />
      <div className="builderContainer">
        <Navbar />
        <div className="builderContent">
          <div className="header">
            <Link to="/resources" className="backButton">
              <ArrowBackIcon /> Back to Resources
            </Link>
            <h1>
              <PresentationIcon className="titleIcon" />
              Pitch Deck Builder
            </h1>
            <p>Build your investor-ready pitch deck step by step</p>
          </div>

          <div className="progressSection">
            <div className="progressHeader">
              <span>Progress: {completedSlides} of {slides.length} slides completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progressBar">
              <div className="progressFill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="actions">
            <button className="actionButton save" onClick={handleSave}>
              <SaveIcon /> Save Progress
            </button>
            <button className="actionButton export" onClick={handleExport}>
              <DownloadIcon /> Export Data
            </button>
          </div>

          <div className="mainContent">
            <div className="slideNav">
              <h3>Slide Navigation</h3>
              <div className="slideList">
                {slides.map((s, index) => (
                  <div
                    key={s.id}
                    className={`slideItem ${currentSlide === index ? 'active' : ''} ${isSlideComplete(index) ? 'completed' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div className="slideIcon">
                      {isSlideComplete(index) ? (
                        <CheckCircleIcon className="checkIcon" />
                      ) : (
                        <RadioButtonUncheckedIcon className="uncheckedIcon" />
                      )}
                    </div>
                    <div className="slideInfo">
                      <div className="slideNumber">Slide {s.id}</div>
                      <div className="slideTitle">{s.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="slideEditor">
              <div className="slideHeader">
                <div className="slideMeta">
                  <span className="slideNumber">Slide {slide.id} of {slides.length}</span>
                </div>
                <h2>{slide.title}</h2>
                <p className="slideDescription">{slide.description}</p>
              </div>

              <div className="slideForm">
                {slide.fields.map(field => (
                  <div key={field} className="formGroup">
                    <label>{fieldLabels[field]}</label>
                    <textarea
                      placeholder={fieldPlaceholders[field]}
                      value={pitchDeck[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      rows={field.includes('Name') || field.includes('email') || field.includes('phone') || field.includes('website') ? 1 : 4}
                    />
                  </div>
                ))}
              </div>

              <div className="slideNavigation">
                <button
                  className="navButton prev"
                  onClick={goToPrev}
                  disabled={currentSlide === 0}
                >
                  <NavigateBeforeIcon /> Previous
                </button>
                <button
                  className="navButton next"
                  onClick={goToNext}
                  disabled={currentSlide === slides.length - 1}
                >
                  Next <NavigateNextIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckBuilder;
