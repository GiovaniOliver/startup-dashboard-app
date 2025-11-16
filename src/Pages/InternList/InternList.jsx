import "./InternList.scss";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import { internData } from "../../data/internData";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const InternList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("All");
  const [filterMajor, setFilterMajor] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Get unique values for filters
  const universities = ["All", ...new Set(internData.map(intern => intern.university))];
  const majors = ["All", ...new Set(internData.map(intern => intern.major))];
  const statuses = ["All", "Active", "Completed"];

  // Filter interns based on search and filters
  const filteredInterns = internData.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.major.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUniversity = filterUniversity === "All" || intern.university === filterUniversity;
    const matchesMajor = filterMajor === "All" || intern.major === filterMajor;
    const matchesStatus = filterStatus === "All" || intern.status === filterStatus;

    return matchesSearch && matchesUniversity && matchesMajor && matchesStatus;
  });

  // Calculate statistics
  const activeInterns = internData.filter(intern => intern.status === "Active").length;
  const totalStipend = internData.reduce((sum, intern) => sum + intern.stipend, 0);
  const averageGPA = (internData.reduce((sum, intern) => sum + intern.gpa, 0) / internData.length).toFixed(2);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this intern?")) {
      // In a real application, this would call an API to delete the intern
      console.log("Deleting intern with id:", id);
    }
  };

  return (
    <div className="internList">
      <Sidebar />
      <div className="internListContainer">
        <Navbar />

        <div className="contentWrapper">
          {/* Header Section */}
          <div className="listHeader">
            <h1 className="title">Intern Management</h1>
            <Link to="/interns/new" className="addButton">
              <AddIcon />
              <span>Add New Intern</span>
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="statsContainer">
            <div className="statCard">
              <div className="statTitle">Total Interns</div>
              <div className="statValue">{internData.length}</div>
            </div>
            <div className="statCard">
              <div className="statTitle">Active Interns</div>
              <div className="statValue">{activeInterns}</div>
            </div>
            <div className="statCard">
              <div className="statTitle">Total Stipend</div>
              <div className="statValue">${totalStipend.toLocaleString()}/mo</div>
            </div>
            <div className="statCard">
              <div className="statTitle">Average GPA</div>
              <div className="statValue">{averageGPA}</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="filterSection">
            <div className="searchBox">
              <SearchIcon className="searchIcon" />
              <input
                type="text"
                placeholder="Search by name, university, or major..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filters">
              <select
                value={filterUniversity}
                onChange={(e) => setFilterUniversity(e.target.value)}
                className="filterSelect"
              >
                {universities.map((uni, index) => (
                  <option key={index} value={uni}>{uni}</option>
                ))}
              </select>

              <select
                value={filterMajor}
                onChange={(e) => setFilterMajor(e.target.value)}
                className="filterSelect"
              >
                {majors.map((major, index) => (
                  <option key={index} value={major}>{major}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filterSelect"
              >
                {statuses.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interns Table */}
          <div className="tableContainer">
            <table className="internTable">
              <thead>
                <tr>
                  <th>Intern</th>
                  <th>University</th>
                  <th>Major</th>
                  <th>GPA</th>
                  <th>Stipend</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Mentor</th>
                  <th>Status</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterns.length > 0 ? (
                  filteredInterns.map((intern) => {
                    const avgProgress = intern.learningGoals.length > 0
                      ? Math.round(intern.learningGoals.reduce((sum, goal) => sum + goal.progress, 0) / intern.learningGoals.length)
                      : 0;

                    return (
                      <tr key={intern.id}>
                        <td>
                          <div className="internInfo">
                            <img src={intern.avatar} alt={intern.name} className="avatar" />
                            <div className="details">
                              <span className="name">{intern.name}</span>
                              <span className="email">{intern.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{intern.university}</td>
                        <td>{intern.major}</td>
                        <td>
                          <span className={`gpa ${intern.gpa >= 3.8 ? 'high' : intern.gpa >= 3.5 ? 'medium' : 'normal'}`}>
                            {intern.gpa.toFixed(2)}
                          </span>
                        </td>
                        <td>${intern.stipend.toLocaleString()}</td>
                        <td>{new Date(intern.startDate).toLocaleDateString()}</td>
                        <td>{new Date(intern.endDate).toLocaleDateString()}</td>
                        <td>{intern.mentor}</td>
                        <td>
                          <span className={`status ${intern.status.toLowerCase()}`}>
                            {intern.status}
                          </span>
                        </td>
                        <td>
                          <div className="performanceCell">
                            <div className="progressBar">
                              <div className="progressFill" style={{ width: `${avgProgress}%` }}></div>
                            </div>
                            <span className="progressText">{avgProgress}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="actions">
                            <Link to={`/interns/${intern.id}`} className="actionButton view">
                              <VisibilityIcon />
                            </Link>
                            <Link to={`/interns/edit/${intern.id}`} className="actionButton edit">
                              <EditIcon />
                            </Link>
                            <button onClick={() => handleDelete(intern.id)} className="actionButton delete">
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" className="noData">
                      No interns found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="tableSummary">
            Showing {filteredInterns.length} of {internData.length} interns
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternList;
