import "./single.scss";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { teamMembers } from "../../data/teamData";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Single = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    const foundMember = teamMembers.find((m) => m.id === parseInt(userId));
    setMember(foundMember);
  }, [userId]);

  if (!member) {
    return (
      <div className="single">
        <Sidebar />
        <div className="singleContainer">
          <Navbar />
          <div className="top">
            <h1>Team Member Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  const salaryChartData = member.salaryHistory.map((item) => ({
    year: item.year.toString(),
    salary: item.amount,
  }));

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="singleContent">
          <div className="top">
            <div className="left">
              <div className="editButton" onClick={() => navigate(`/user/new?id=${member.id}`)}>
                <EditIcon />
                Edit
              </div>
              <h1 className="title">Team Member Information</h1>
              <div className="item">
                <img src={member.profilePicture} alt="" className="itemImg" />
                <div className="details">
                  <h1 className="itemTitle">{member.name}</h1>
                  <div className="detailItem">
                    <WorkIcon className="itemIcon" />
                    <span className="itemValue">{member.role}</span>
                  </div>
                  <div className="detailItem">
                    <EmailIcon className="itemIcon" />
                    <span className="itemValue">{member.email}</span>
                  </div>
                  <div className="detailItem">
                    <PhoneIcon className="itemIcon" />
                    <span className="itemValue">{member.phone}</span>
                  </div>
                  <div className="detailItem">
                    <LocationOnIcon className="itemIcon" />
                    <span className="itemValue">{member.address}</span>
                  </div>
                  <div className="detailItem">
                    <CalendarMonthIcon className="itemIcon" />
                    <span className="itemValue">
                      Started: {new Date(member.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detailItem">
                    <AttachMoneyIcon className="itemIcon" />
                    <span className="itemValue">
                      ${member.salary.toLocaleString()} / year
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Status:</span>
                    <span className={`status ${member.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Department:</span>
                    <span className="itemValue">{member.department}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="right">
              <div className="statsCard">
                <h2 className="statsTitle">Performance Metrics</h2>
                <div className="statsGrid">
                  <div className="statItem">
                    <span className="statLabel">Performance Score</span>
                    <div className="scoreCircle">
                      <span className="scoreValue">{member.performanceScore}%</span>
                    </div>
                  </div>
                  <div className="statItem">
                    <span className="statLabel">Tasks Completed</span>
                    <span className="statValue large">{member.tasksCompleted}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom">
            <div className="bottomLeft">
              <h2 className="sectionTitle">About</h2>
              <p className="bio">{member.bio}</p>

              <h2 className="sectionTitle">Skills & Expertise</h2>
              <div className="skillsContainer">
                {member.skills.map((skill, index) => (
                  <span key={index} className="skillTag">
                    {skill}
                  </span>
                ))}
              </div>

              <h2 className="sectionTitle">Recent Tasks</h2>
              <div className="tasksTable">
                <table>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Complete dashboard redesign</td>
                      <td><span className="taskStatus completed">Completed</span></td>
                      <td>2023-10-15</td>
                    </tr>
                    <tr>
                      <td>Fix authentication bug</td>
                      <td><span className="taskStatus completed">Completed</span></td>
                      <td>2023-10-10</td>
                    </tr>
                    <tr>
                      <td>Implement new feature</td>
                      <td><span className="taskStatus inProgress">In Progress</span></td>
                      <td>2023-10-20</td>
                    </tr>
                    <tr>
                      <td>Code review for team</td>
                      <td><span className="taskStatus pending">Pending</span></td>
                      <td>2023-10-25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bottomRight">
              <h2 className="sectionTitle">Salary History</h2>
              <div className="chartContainer">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salaryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="salary"
                      stroke="#7451f8"
                      strokeWidth={2}
                      dot={{ fill: '#7451f8', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="salaryHistoryTable">
                <table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Salary</th>
                      <th>Increase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {member.salaryHistory.map((item, index) => {
                      const increase =
                        index > 0
                          ? ((item.amount - member.salaryHistory[index - 1].amount) /
                              member.salaryHistory[index - 1].amount) *
                            100
                          : 0;
                      return (
                        <tr key={item.year}>
                          <td>{item.year}</td>
                          <td>${item.amount.toLocaleString()}</td>
                          <td>
                            {index > 0 && (
                              <span className="increase">+{increase.toFixed(1)}%</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;