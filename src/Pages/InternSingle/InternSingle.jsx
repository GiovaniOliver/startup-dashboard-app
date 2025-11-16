import "./InternSingle.scss";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import { internData } from "../../data/internData";
import { useParams, Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import StarIcon from '@mui/icons-material/Star';

const InternSingle = () => {
  const { internId } = useParams();
  const intern = internData.find(i => i.id === parseInt(internId));

  if (!intern) {
    return (
      <div className="internSingle">
        <Sidebar />
        <div className="internSingleContainer">
          <Navbar />
          <div className="notFound">
            <h2>Intern not found</h2>
            <Link to="/interns" className="backButton">
              <ArrowBackIcon />
              Back to Interns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate average evaluation score
  const averageEvaluation = intern.evaluations.length > 0
    ? (intern.evaluations.reduce((sum, evaluation) => sum + evaluation.overallRating, 0) / intern.evaluations.length).toFixed(2)
    : "N/A";

  // Calculate task completion rate
  const completedTasks = intern.assignedTasks.filter(task => task.status === "Completed").length;
  const taskCompletionRate = intern.assignedTasks.length > 0
    ? Math.round((completedTasks / intern.assignedTasks.length) * 100)
    : 0;

  return (
    <div className="internSingle">
      <Sidebar />
      <div className="internSingleContainer">
        <Navbar />

        <div className="contentWrapper">
          {/* Header Section */}
          <div className="pageHeader">
            <Link to="/interns" className="backLink">
              <ArrowBackIcon />
              Back to Interns
            </Link>
            <Link to={`/interns/edit/${intern.id}`} className="editButton">
              <EditIcon />
              Edit Intern
            </Link>
          </div>

          {/* Profile Section */}
          <div className="profileSection">
            <div className="profileCard">
              <div className="profileHeader">
                <img src={intern.avatar} alt={intern.name} className="avatar" />
                <div className="profileInfo">
                  <h1 className="name">{intern.name}</h1>
                  <p className="university">
                    <SchoolIcon />
                    {intern.university} - {intern.major}
                  </p>
                  <div className="contactInfo">
                    <span className="contact">
                      <EmailIcon />
                      {intern.email}
                    </span>
                    <span className="contact">
                      <PhoneIcon />
                      {intern.phone}
                    </span>
                  </div>
                  <span className={`status ${intern.status.toLowerCase()}`}>
                    {intern.status}
                  </span>
                </div>
              </div>

              <div className="profileDetails">
                <div className="detailItem">
                  <span className="label">Year</span>
                  <span className="value">{intern.year}</span>
                </div>
                <div className="detailItem">
                  <span className="label">GPA</span>
                  <span className="value">{intern.gpa.toFixed(2)}</span>
                </div>
                <div className="detailItem">
                  <span className="label">Stipend</span>
                  <span className="value">${intern.stipend}/month</span>
                </div>
                <div className="detailItem">
                  <span className="label">Duration</span>
                  <span className="value">
                    {new Date(intern.startDate).toLocaleDateString()} - {new Date(intern.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="label">Mentor</span>
                  <span className="value">{intern.mentor}</span>
                </div>
              </div>

              <div className="skillsSection">
                <h3>Skills</h3>
                <div className="skillTags">
                  {intern.skills.map((skill, index) => (
                    <span key={index} className="skillTag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quickStats">
              <div className="statBox">
                <div className="statIcon attendance">
                  <CalendarTodayIcon />
                </div>
                <div className="statContent">
                  <span className="statLabel">Attendance</span>
                  <span className="statValue">{intern.attendanceRecord.attendanceRate}%</span>
                  <span className="statSubtext">
                    {intern.attendanceRecord.present}/{intern.attendanceRecord.totalDays} days
                  </span>
                </div>
              </div>

              <div className="statBox">
                <div className="statIcon performance">
                  <TrendingUpIcon />
                </div>
                <div className="statContent">
                  <span className="statLabel">Performance</span>
                  <span className="statValue">{averageEvaluation}</span>
                  <span className="statSubtext">Average Rating</span>
                </div>
              </div>

              <div className="statBox">
                <div className="statIcon tasks">
                  <AssignmentIcon />
                </div>
                <div className="statContent">
                  <span className="statLabel">Tasks</span>
                  <span className="statValue">{taskCompletionRate}%</span>
                  <span className="statSubtext">
                    {completedTasks}/{intern.assignedTasks.length} completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Goals Section */}
          <div className="section">
            <h2 className="sectionTitle">Learning Goals & Progress</h2>
            <div className="learningGoals">
              {intern.learningGoals.map((goal, index) => (
                <div key={index} className="goalCard">
                  <div className="goalHeader">
                    <span className="goalName">{goal.goal}</span>
                    <span className="goalProgress">{goal.progress}%</span>
                  </div>
                  <div className="progressBar">
                    <div
                      className="progressFill"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <span className={`goalStatus ${goal.status.toLowerCase().replace(' ', '-')}`}>
                    {goal.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks and Projects Grid */}
          <div className="gridSection">
            {/* Assigned Tasks */}
            <div className="section">
              <h2 className="sectionTitle">Assigned Tasks</h2>
              <div className="tasksList">
                {intern.assignedTasks.map((task) => (
                  <div key={task.id} className="taskCard">
                    <div className="taskHeader">
                      <div className="taskIcon">
                        {task.status === "Completed" ? (
                          <CheckCircleIcon className="completed" />
                        ) : task.status === "In Progress" ? (
                          <PendingIcon className="inProgress" />
                        ) : (
                          <AssignmentIcon className="pending" />
                        )}
                      </div>
                      <div className="taskInfo">
                        <h4>{task.title}</h4>
                        <span className="taskDue">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`taskStatus ${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Projects */}
            <div className="section">
              <h2 className="sectionTitle">Assigned Projects</h2>
              <div className="projectsList">
                {intern.assignedProjects.map((project) => (
                  <div key={project.id} className="projectCard">
                    <div className="projectIcon">
                      <WorkIcon />
                    </div>
                    <div className="projectInfo">
                      <h4>{project.name}</h4>
                      <p className="projectRole">{project.role}</p>
                      <div className="contributionBar">
                        <div className="contributionLabel">Contribution</div>
                        <div className="contributionProgress">
                          <div
                            className="contributionFill"
                            style={{ width: `${project.contribution}%` }}
                          ></div>
                        </div>
                        <span className="contributionValue">{project.contribution}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Onboarding Checklist */}
          <div className="section">
            <h2 className="sectionTitle">Onboarding Checklist</h2>
            <div className="checklistGrid">
              {intern.onboardingChecklist.map((item, index) => (
                <div key={index} className={`checklistItem ${item.completed ? 'completed' : ''}`}>
                  <CheckCircleIcon className="checkIcon" />
                  <span>{item.item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluations */}
          {intern.evaluations.length > 0 && (
            <div className="section">
              <h2 className="sectionTitle">Performance Evaluations</h2>
              <div className="evaluationsList">
                {intern.evaluations.map((evaluation, index) => (
                  <div key={index} className="evaluationCard">
                    <div className="evaluationHeader">
                      <div className="evaluationDate">
                        <CalendarTodayIcon />
                        {new Date(evaluation.date).toLocaleDateString()}
                      </div>
                      <div className="evaluator">
                        <PersonIcon />
                        {evaluation.evaluator}
                      </div>
                      <div className="overallRating">
                        <StarIcon />
                        {evaluation.overallRating.toFixed(1)}
                      </div>
                    </div>

                    <div className="evaluationScores">
                      <div className="scoreItem">
                        <span className="scoreLabel">Technical Skills</span>
                        <div className="scoreBar">
                          <div
                            className="scoreFill"
                            style={{ width: `${(evaluation.technicalSkills / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="scoreValue">{evaluation.technicalSkills}/5</span>
                      </div>

                      <div className="scoreItem">
                        <span className="scoreLabel">Communication</span>
                        <div className="scoreBar">
                          <div
                            className="scoreFill"
                            style={{ width: `${(evaluation.communication / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="scoreValue">{evaluation.communication}/5</span>
                      </div>

                      <div className="scoreItem">
                        <span className="scoreLabel">Teamwork</span>
                        <div className="scoreBar">
                          <div
                            className="scoreFill"
                            style={{ width: `${(evaluation.teamwork / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="scoreValue">{evaluation.teamwork}/5</span>
                      </div>

                      <div className="scoreItem">
                        <span className="scoreLabel">Initiative</span>
                        <div className="scoreBar">
                          <div
                            className="scoreFill"
                            style={{ width: `${(evaluation.initiative / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="scoreValue">{evaluation.initiative}/5</span>
                      </div>
                    </div>

                    <div className="evaluationComments">
                      <h4>Comments</h4>
                      <p>{evaluation.comments}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Notes */}
          {intern.interviewNotes && (
            <div className="section">
              <h2 className="sectionTitle">Interview Notes</h2>
              <div className="interviewNotes">
                <p>{intern.interviewNotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternSingle;
