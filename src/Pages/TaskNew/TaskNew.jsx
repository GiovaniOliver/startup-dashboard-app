import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../Components/sidebar/Sidebar';
import Navbar from '../../Components/navbar/Navbar';
import './TaskNew.scss';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import taskData from '../../data/taskData';

const TaskNew = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!taskId;

  const existingTask = isEditMode ? taskData.find(t => t.id === parseInt(taskId)) : null;

  const [formData, setFormData] = useState({
    title: existingTask?.title || '',
    description: existingTask?.description || '',
    priority: existingTask?.priority || 'medium',
    status: existingTask?.status || 'todo',
    assigneeType: existingTask?.assigneeType || 'team',
    assigneeId: existingTask?.assigneeId || '',
    assigneeName: existingTask?.assigneeName || '',
    assigneeHourlyRate: existingTask?.assigneeHourlyRate || '',
    dueDate: existingTask?.dueDate || '',
    startDate: existingTask?.startDate || '',
    estimatedHours: existingTask?.estimatedHours || '',
    budget: existingTask?.budget || '',
    tags: existingTask?.tags || [],
    dependencies: existingTask?.dependencies || []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [subtasks, setSubtasks] = useState(existingTask?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');

  // Sample team members and interns for dropdown
  const teamMembers = [
    { id: 1, name: 'Sarah Chen', rate: 85 },
    { id: 2, name: 'Alex Rivera', rate: 75 },
    { id: 3, name: 'Jordan Lee', rate: 90 }
  ];

  const interns = [
    { id: 1, name: 'Emily Watson', rate: 25 },
    { id: 2, name: 'David Park', rate: 28 },
    { id: 3, name: 'Lisa Martinez', rate: 22 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssigneeChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const assigneeList = formData.assigneeType === 'team' ? teamMembers : interns;
    const assignee = assigneeList.find(a => a.id === selectedId);

    if (assignee) {
      setFormData(prev => ({
        ...prev,
        assigneeId: assignee.id,
        assigneeName: assignee.name,
        assigneeHourlyRate: assignee.rate
      }));
    }
  };

  const handleAssigneeTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      assigneeType: e.target.value,
      assigneeId: '',
      assigneeName: '',
      assigneeHourlyRate: ''
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: subtasks.length + 1,
          title: newSubtask.trim(),
          completed: false
        }
      ]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (subtaskId) => {
    setSubtasks(subtasks.filter(st => st.id !== subtaskId));
  };

  const handleDependencyChange = (e) => {
    const options = e.target.options;
    const selectedDeps = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedDeps.push(parseInt(options[i].value));
      }
    }
    setFormData(prev => ({
      ...prev,
      dependencies: selectedDeps
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (!formData.assigneeId) {
      alert('Please select an assignee');
      return;
    }

    // Calculate budget if not manually entered
    const calculatedBudget = formData.budget ||
      (formData.estimatedHours * formData.assigneeHourlyRate);

    const taskDataToSave = {
      ...formData,
      budget: calculatedBudget,
      subtasks,
      estimatedHours: parseFloat(formData.estimatedHours) || 0,
      actualHours: isEditMode ? existingTask.actualHours : 0,
      comments: isEditMode ? existingTask.comments : [],
      attachments: isEditMode ? existingTask.attachments : [],
      activityLog: isEditMode ? existingTask.activityLog : []
    };

    // In a real app, this would save to backend
    alert(isEditMode ? 'Task updated successfully!' : 'Task created successfully!');
    navigate('/tasks');
  };

  return (
    <div className="taskNew">
      <Sidebar />
      <div className="taskNewContainer">
        <Navbar />

        <div className="task-form-content">
          <div className="form-header">
            <div className="header-left">
              <Link to="/tasks" className="back-btn">
                <BackIcon /> Back to Tasks
              </Link>
              <h1>{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-grid">
              {/* Left Column */}
              <div className="form-main">
                <div className="form-section">
                  <h2>Basic Information</h2>

                  <div className="form-group">
                    <label>Task Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the task in detail..."
                      rows="6"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Priority *</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Status *</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="in-review">In Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h2>Assignee</h2>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Assignee Type *</label>
                      <select
                        value={formData.assigneeType}
                        onChange={handleAssigneeTypeChange}
                        required
                      >
                        <option value="team">Team Member</option>
                        <option value="intern">Intern</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Select Assignee *</label>
                      <select
                        value={formData.assigneeId}
                        onChange={handleAssigneeChange}
                        required
                      >
                        <option value="">Choose assignee...</option>
                        {(formData.assigneeType === 'team' ? teamMembers : interns).map(person => (
                          <option key={person.id} value={person.id}>
                            {person.name} (${person.rate}/hr)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {formData.assigneeHourlyRate && (
                    <div className="assignee-info-display">
                      <p>
                        <strong>{formData.assigneeName}</strong> -
                        ${formData.assigneeHourlyRate}/hour
                      </p>
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h2>Timeline & Budget</h2>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Due Date *</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Estimated Hours *</label>
                      <input
                        type="number"
                        name="estimatedHours"
                        value={formData.estimatedHours}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        step="0.5"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Budget ($)</label>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder={
                          formData.estimatedHours && formData.assigneeHourlyRate
                            ? `Auto: ${formData.estimatedHours * formData.assigneeHourlyRate}`
                            : 'Auto-calculated'
                        }
                        min="0"
                        step="0.01"
                      />
                      {formData.estimatedHours && formData.assigneeHourlyRate && !formData.budget && (
                        <small className="help-text">
                          Auto-calculated: ${formData.estimatedHours * formData.assigneeHourlyRate}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h2>Subtasks</h2>

                  <div className="subtasks-list">
                    {subtasks.map(subtask => (
                      <div key={subtask.id} className="subtask-item">
                        <span>{subtask.title}</span>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeSubtask(subtask.id)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="add-subtask">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Add a subtask..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                    />
                    <button type="button" onClick={addSubtask} className="add-btn">
                      <AddIcon /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="form-sidebar">
                <div className="form-section">
                  <h2>Tags</h2>

                  <div className="tags-display">
                    {formData.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="remove-tag-btn"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="add-tag">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button type="button" onClick={addTag} className="add-btn-small">
                      <AddIcon />
                    </button>
                  </div>

                  <div className="suggested-tags">
                    <small>Suggested:</small>
                    {['frontend', 'backend', 'design', 'bug', 'feature', 'testing'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className="suggested-tag"
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...prev.tags, tag]
                            }));
                          }
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <h2>Dependencies</h2>
                  <p className="help-text">Select tasks that must be completed before this one</p>

                  <select
                    multiple
                    value={formData.dependencies.map(String)}
                    onChange={handleDependencyChange}
                    className="dependencies-select"
                  >
                    {taskData
                      .filter(t => !isEditMode || t.id !== parseInt(taskId))
                      .map(task => (
                        <option key={task.id} value={task.id}>
                          {task.title}
                        </option>
                      ))}
                  </select>
                  <small className="help-text">Hold Ctrl/Cmd to select multiple</small>
                </div>

                <div className="form-section summary-section">
                  <h2>Summary</h2>
                  <div className="summary-item">
                    <label>Duration:</label>
                    <span>
                      {formData.startDate && formData.dueDate
                        ? `${Math.ceil(
                            (new Date(formData.dueDate) - new Date(formData.startDate)) /
                            (1000 * 60 * 60 * 24)
                          )} days`
                        : '—'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <label>Estimated Cost:</label>
                    <span>
                      ${formData.budget ||
                        (formData.estimatedHours && formData.assigneeHourlyRate
                          ? (formData.estimatedHours * formData.assigneeHourlyRate).toLocaleString()
                          : '0')}
                    </span>
                  </div>
                  <div className="summary-item">
                    <label>Subtasks:</label>
                    <span>{subtasks.length}</span>
                  </div>
                  <div className="summary-item">
                    <label>Tags:</label>
                    <span>{formData.tags.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link to="/tasks" className="cancel-btn">
                Cancel
              </Link>
              <button type="submit" className="save-btn">
                <SaveIcon /> {isEditMode ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskNew;
