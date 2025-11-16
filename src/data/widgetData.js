import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

// Widget configuration data
export const widgetData = {
  team: {
    type: "team",
    title: "TEAM MEMBERS",
    value: 142,
    percentage: 12,
    isMoney: false,
    link: "View all members",
    linkTo: "/users",
    icon: (
      <PersonOutlineOutlinedIcon
        className="icon"
        style={{
          color: "crimson",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
        }}
      />
    ),
    chartData: [
      { name: "Mon", value: 130 },
      { name: "Tue", value: 135 },
      { name: "Wed", value: 138 },
      { name: "Thu", value: 136 },
      { name: "Fri", value: 140 },
      { name: "Sat", value: 142 },
      { name: "Sun", value: 142 },
    ],
    chartColor: "#ff4569",
  },
  budget: {
    type: "budget",
    title: "TOTAL BUDGET",
    value: 825000,
    percentage: 8.5,
    isMoney: true,
    link: "View financial details",
    linkTo: "/finance",
    icon: (
      <AccountBalanceWalletOutlinedIcon
        className="icon"
        style={{
          backgroundColor: "rgba(128, 0, 128, 0.2)",
          color: "purple",
        }}
      />
    ),
    chartData: [
      { name: "Mon", value: 780000 },
      { name: "Tue", value: 790000 },
      { name: "Wed", value: 800000 },
      { name: "Thu", value: 805000 },
      { name: "Fri", value: 815000 },
      { name: "Sat", value: 820000 },
      { name: "Sun", value: 825000 },
    ],
    chartColor: "#8b5cf6",
  },
  tasks: {
    type: "tasks",
    title: "ACTIVE TASKS",
    value: 47,
    percentage: -5.2,
    isMoney: false,
    link: "See all tasks",
    linkTo: "/tasks",
    icon: (
      <AssignmentOutlinedIcon
        className="icon"
        style={{
          backgroundColor: "rgba(218, 165, 32, 0.2)",
          color: "goldenrod",
        }}
      />
    ),
    chartData: [
      { name: "Mon", value: 52 },
      { name: "Tue", value: 50 },
      { name: "Wed", value: 51 },
      { name: "Thu", value: 49 },
      { name: "Fri", value: 48 },
      { name: "Sat", value: 47 },
      { name: "Sun", value: 47 },
    ],
    chartColor: "#daa520",
  },
  interns: {
    type: "interns",
    title: "INTERN COUNT",
    value: 28,
    percentage: 15.8,
    isMoney: false,
    link: "View interns",
    linkTo: "/interns",
    icon: (
      <SchoolOutlinedIcon
        className="icon"
        style={{
          backgroundColor: "rgba(0, 128, 0, 0.2)",
          color: "green",
        }}
      />
    ),
    chartData: [
      { name: "Mon", value: 22 },
      { name: "Tue", value: 24 },
      { name: "Wed", value: 25 },
      { name: "Thu", value: 26 },
      { name: "Fri", value: 27 },
      { name: "Sat", value: 28 },
      { name: "Sun", value: 28 },
    ],
    chartColor: "#22c55e",
  },
};
