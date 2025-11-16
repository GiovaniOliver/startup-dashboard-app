import { useState } from 'react';
import './help.scss';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import { faqs } from '../../data/educationalContent';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="help">
      <Sidebar />
      <div className="helpContainer">
        <Navbar />
        <div className="helpContent">
          <div className="header">
            <h1>
              <HelpOutlineIcon className="titleIcon" />
              Help & Support
            </h1>
            <p>Find answers to your questions and learn how to use the platform</p>
          </div>

          <div className="quickActions">
            <div className="actionCard">
              <PlayCircleOutlineIcon className="actionIcon video" />
              <h3>Video Tutorials</h3>
              <p>Watch step-by-step guides</p>
              <button className="actionButton">Watch Now</button>
            </div>
            <div className="actionCard">
              <MenuBookIcon className="actionIcon guide" />
              <h3>User Guide</h3>
              <p>Read comprehensive documentation</p>
              <button className="actionButton">Read Guide</button>
            </div>
            <div className="actionCard">
              <ChatIcon className="actionIcon chat" />
              <h3>Live Chat</h3>
              <p>Chat with our support team</p>
              <button className="actionButton">Start Chat</button>
            </div>
          </div>

          <div className="gettingStarted">
            <h2>Getting Started</h2>
            <div className="stepsGrid">
              <div className="stepCard">
                <div className="stepNumber">1</div>
                <h3>Create Your Account</h3>
                <p>Sign up and complete your profile to get started with the platform.</p>
              </div>
              <div className="stepCard">
                <div className="stepNumber">2</div>
                <h3>Explore Learning Modules</h3>
                <p>Browse through our comprehensive startup courses and begin your learning journey.</p>
              </div>
              <div className="stepCard">
                <div className="stepNumber">3</div>
                <h3>Use Interactive Tools</h3>
                <p>Leverage our business model canvas, calculators, and pitch deck builder.</p>
              </div>
              <div className="stepCard">
                <div className="stepNumber">4</div>
                <h3>Track Your Progress</h3>
                <p>Monitor your learning progress and complete milestones to advance your startup.</p>
              </div>
            </div>
          </div>

          <div className="keyFeatures">
            <h2>Key Features</h2>
            <div className="featuresGrid">
              <div className="featureItem">
                <CheckCircleIcon className="featureIcon" />
                <div>
                  <h4>Learning Center</h4>
                  <p>Access 8 comprehensive modules covering all aspects of building a startup, from ideation to legal compliance.</p>
                </div>
              </div>
              <div className="featureItem">
                <CheckCircleIcon className="featureIcon" />
                <div>
                  <h4>Progress Tracking</h4>
                  <p>Track your course completion with automatic progress saving. Pick up where you left off anytime.</p>
                </div>
              </div>
              <div className="featureItem">
                <CheckCircleIcon className="featureIcon" />
                <div>
                  <h4>Resource Library</h4>
                  <p>Download templates, checklists, and tools to implement what you learn immediately.</p>
                </div>
              </div>
              <div className="featureItem">
                <CheckCircleIcon className="featureIcon" />
                <div>
                  <h4>Interactive Tools</h4>
                  <p>Use the Business Model Canvas, startup calculators, and pitch deck builder to plan your startup.</p>
                </div>
              </div>
              <div className="featureItem">
                <CheckCircleIcon className="featureIcon" />
                <div>
                  <h4>Team Management</h4>
                  <p>Build and manage your team with salary calculators, task assignments, and timeline tracking.</p>
                </div>
              </div>
              <div className="featureItem">
                <CheckCircleIcon className="featureIcon" />
                <div>
                  <h4>Dashboard Analytics</h4>
                  <p>View your startup metrics, progress, and key performance indicators in one place.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="faqSection">
            <h2>Frequently Asked Questions</h2>
            <div className="searchBar">
              <SearchIcon className="searchIcon" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="faqList">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faqItem ${expandedFaq === index ? 'expanded' : ''}`}
                >
                  <div className="faqQuestion" onClick={() => toggleFaq(index)}>
                    <h4>{faq.question}</h4>
                    <ExpandMoreIcon className="expandIcon" />
                  </div>
                  <div className="faqAnswer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            {filteredFaqs.length === 0 && (
              <div className="noResults">
                <p>No FAQs found matching your search.</p>
              </div>
            )}
          </div>

          <div className="contactSection">
            <h2>Still Need Help?</h2>
            <p className="contactDescription">
              Our support team is here to help you succeed. Reach out through any of these channels:
            </p>
            <div className="contactMethods">
              <div className="contactCard">
                <EmailIcon className="contactIcon" />
                <h3>Email Support</h3>
                <p>support@startupdashboard.com</p>
                <p className="responseTime">Response within 24 hours</p>
              </div>
              <div className="contactCard">
                <ChatIcon className="contactIcon" />
                <h3>Live Chat</h3>
                <p>Available Mon-Fri, 9am-6pm EST</p>
                <button className="contactButton">Start Chat</button>
              </div>
              <div className="contactCard">
                <PhoneIcon className="contactIcon" />
                <h3>Phone Support</h3>
                <p>1-800-STARTUP</p>
                <p className="responseTime">Available Mon-Fri, 9am-6pm EST</p>
              </div>
            </div>
          </div>

          <div className="additionalResources">
            <h2>Additional Resources</h2>
            <div className="resourcesList">
              <button className="resourceLink" onClick={() => {}}>
                <MenuBookIcon /> Platform Documentation
              </button>
              <button className="resourceLink" onClick={() => {}}>
                <PlayCircleOutlineIcon /> Video Tutorial Library
              </button>
              <button className="resourceLink" onClick={() => {}}>
                <HelpOutlineIcon /> Community Forum
              </button>
              <button className="resourceLink" onClick={() => {}}>
                <CheckCircleIcon /> Best Practices Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
