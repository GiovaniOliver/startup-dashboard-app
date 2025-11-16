import "./list.scss";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { teamMembers, departments, statuses } from "../../data/teamData";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";

const List = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(teamMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pageSize, setPageSize] = useState(10);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return data.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" || member.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [data, searchTerm, departmentFilter, statusFilter]);

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  // Handle export to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Role", "Email", "Salary", "Start Date", "Status", "Department"];
    const csvData = filteredData.map((member) => [
      member.name,
      member.role,
      member.email,
      member.salary,
      member.startDate,
      member.status,
      member.department,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "team_members.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Define columns
  const columns = [
    {
      field: "profilePicture",
      headerName: "Avatar",
      width: 80,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.profilePicture} alt="avatar" />
          </div>
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
    },
    {
      field: "role",
      headerName: "Role",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "salary",
      headerName: "Salary",
      width: 120,
      renderCell: (params) => {
        return <div className="cellWithSalary">${params.row.salary.toLocaleString()}</div>;
      },
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 130,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {params.row.status}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() => navigate(`/user/${params.row.id}`)}
            >
              <VisibilityIcon />
            </div>
            <div
              className="editButton"
              onClick={() => navigate(`/user/new?id=${params.row.id}`)}
            >
              <EditIcon />
            </div>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteOutlineIcon />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="listContent">
          <div className="listHeader">
            <h1 className="listTitle">Team Members</h1>
            <div className="listActions">
              <button className="exportButton" onClick={exportToCSV}>
                <FileDownloadIcon />
                Export CSV
              </button>
              <Link to="/user/new" className="link">
                <button className="addButton">
                  <AddIcon />
                  Add New Team Member
                </button>
              </Link>
            </div>
          </div>

          <div className="listFilters">
            <div className="searchBar">
              <SearchIcon className="searchIcon" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchInput"
              />
            </div>

            <div className="filterGroup">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="filterSelect"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "All" ? "All Departments" : dept}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filterSelect"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All Statuses" : status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="dataTable">
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20, 50]}
              checkboxSelection
              disableSelectionOnClick
              autoHeight
              pagination
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;