import { useState } from 'react';
import { Link } from 'react-router-dom';
import './resources.scss';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import { resources } from '../../data/educationalContent';
import FolderIcon from '@mui/icons-material/Folder';
import DownloadIcon from '@mui/icons-material/Download';
import ChecklistIcon from '@mui/icons-material/Checklist';
import BuildIcon from '@mui/icons-material/Build';
import LinkIcon from '@mui/icons-material/Link';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('templates');

  const filterResources = (items) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="resources">
      <Sidebar />
      <div className="resourcesContainer">
        <Navbar />
        <div className="resourcesContent">
          <div className="header">
            <div className="headerLeft">
              <h1>
                <FolderIcon className="titleIcon" />
                Resource Library
              </h1>
              <p>Templates, checklists, tools, and external resources to help you succeed</p>
            </div>
          </div>

          <div className="searchBar">
            <SearchIcon className="searchIcon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="tabNavigation">
            <button
              className={activeTab === 'templates' ? 'active' : ''}
              onClick={() => setActiveTab('templates')}
            >
              <DescriptionIcon /> Templates
            </button>
            <button
              className={activeTab === 'checklists' ? 'active' : ''}
              onClick={() => setActiveTab('checklists')}
            >
              <ChecklistIcon /> Checklists
            </button>
            <button
              className={activeTab === 'tools' ? 'active' : ''}
              onClick={() => setActiveTab('tools')}
            >
              <BuildIcon /> Interactive Tools
            </button>
            <button
              className={activeTab === 'external' ? 'active' : ''}
              onClick={() => setActiveTab('external')}
            >
              <LinkIcon /> External Resources
            </button>
          </div>

          {activeTab === 'templates' && (
            <div className="templatesSection">
              {resources.templates.map((category, idx) => (
                <div key={idx} className="categorySection">
                  <h2 className="categoryTitle">
                    <FolderIcon /> {category.category}
                  </h2>
                  <div className="resourceGrid">
                    {filterResources(category.items).map((item, itemIdx) => (
                      <div key={itemIdx} className="resourceCard">
                        <div className="resourceHeader">
                          <DescriptionIcon className="resourceIcon" />
                          <span className="formatBadge">{item.format}</span>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <button className="downloadButton">
                          <DownloadIcon /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                  {filterResources(category.items).length === 0 && (
                    <p className="noResults">No templates found matching your search.</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'checklists' && (
            <div className="checklistsSection">
              <div className="checklistsGrid">
                {filterResources(resources.checklists).map((checklist, idx) => (
                  <div key={idx} className="checklistCard">
                    <div className="checklistHeader">
                      <ChecklistIcon className="checklistIcon" />
                      <h3>{checklist.title}</h3>
                    </div>
                    <p className="checklistDescription">{checklist.description}</p>
                    <div className="checklistItems">
                      <div className="itemsPreview">
                        {checklist.items.slice(0, 5).map((item, itemIdx) => (
                          <div key={itemIdx} className="checklistItem">
                            <input type="checkbox" id={`check-${idx}-${itemIdx}`} />
                            <label htmlFor={`check-${idx}-${itemIdx}`}>{item}</label>
                          </div>
                        ))}
                        {checklist.items.length > 5 && (
                          <div className="moreItems">
                            +{checklist.items.length - 5} more items
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="checklistFooter">
                      <span className="itemCount">{checklist.items.length} items</span>
                      <button className="downloadButton">
                        <DownloadIcon /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filterResources(resources.checklists).length === 0 && (
                <p className="noResults">No checklists found matching your search.</p>
              )}
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="toolsSection">
              <div className="toolsGrid">
                {filterResources(resources.tools).map((tool, idx) => (
                  <Link key={idx} to={tool.link} className="toolCard">
                    <BuildIcon className="toolIcon" />
                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>
                    <button className="launchButton">
                      Launch Tool <OpenInNewIcon />
                    </button>
                  </Link>
                ))}
              </div>
              {filterResources(resources.tools).length === 0 && (
                <p className="noResults">No tools found matching your search.</p>
              )}
            </div>
          )}

          {activeTab === 'external' && (
            <div className="externalSection">
              {resources.externalResources.map((category, idx) => (
                <div key={idx} className="externalCategory">
                  <h2 className="categoryTitle">
                    <LinkIcon /> {category.category}
                  </h2>
                  <div className="linksGrid">
                    {category.links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="linkCard"
                      >
                        <div className="linkHeader">
                          <LinkIcon className="linkIcon" />
                          <OpenInNewIcon className="externalIcon" />
                        </div>
                        <h4>{link.title}</h4>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
