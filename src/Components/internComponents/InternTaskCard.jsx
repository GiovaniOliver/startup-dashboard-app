import "./InternTaskCard.scss";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const InternTaskCard = ({ task, onStatusChange }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="completed" />;
      case "In Progress":
        return <PendingIcon className="inProgress" />;
      default:
        return <AssignmentIcon className="pending" />;
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className={`internTaskCard ${getStatusClass(task.status)}`}>
      <div className="taskIcon">
        {getStatusIcon(task.status)}
      </div>

      <div className="taskContent">
        <h4 className="taskTitle">{task.title}</h4>
        <div className="taskMeta">
          <span className="taskDue">
            <CalendarTodayIcon />
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="taskActions">
        <span className={`taskStatus ${getStatusClass(task.status)}`}>
          {task.status}
        </span>
        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="statusSelect"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default InternTaskCard;
