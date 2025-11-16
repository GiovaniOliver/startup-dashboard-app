import "./InternNew.scss";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { internData } from "../../data/internData";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';

const InternNew = () => {
  const navigate = useNavigate();
  const { internId } = useParams();
  const isEditMode = !!internId;

  // Find intern if in edit mode
  const existingIntern = isEditMode ? internData.find(i => i.id === parseInt(internId)) : null;

  const [formData, setFormData] = useState({
    name: existingIntern?.name || "",
    email: existingIntern?.email || "",
    phone: existingIntern?.phone || "",
    university: existingIntern?.university || "",
    major: existingIntern?.major || "",
    year: existingIntern?.year || "",
    gpa: existingIntern?.gpa || "",
    skills: existingIntern?.skills?.join(", ") || "",
    stipend: existingIntern?.stipend || "",
    startDate: existingIntern?.startDate || "",
    endDate: existingIntern?.endDate || "",
    mentor: existingIntern?.mentor || "",
    status: existingIntern?.status || "Active",
    interviewNotes: existingIntern?.interviewNotes || "",
  });

  const [errors, setErrors] = useState({});
  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setResumeFile(file);
        setErrors(prev => ({ ...prev, resume: "" }));
      } else {
        setErrors(prev => ({ ...prev, resume: "Please upload a PDF or Word document" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.university.trim()) newErrors.university = "University is required";
    if (!formData.major.trim()) newErrors.major = "Major is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.gpa) {
      newErrors.gpa = "GPA is required";
    } else if (formData.gpa < 0 || formData.gpa > 4.0) {
      newErrors.gpa = "GPA must be between 0 and 4.0";
    }
    if (!formData.skills.trim()) newErrors.skills = "At least one skill is required";
    if (!formData.stipend) {
      newErrors.stipend = "Stipend is required";
    } else if (formData.stipend < 0) {
      newErrors.stipend = "Stipend must be positive";
    }
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!formData.mentor.trim()) newErrors.mentor = "Mentor is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real application, this would call an API to save the intern
      const internPayload = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()),
        gpa: parseFloat(formData.gpa),
        stipend: parseFloat(formData.stipend),
        resumeFile: resumeFile,
      };

      console.log(isEditMode ? "Updating intern:" : "Creating new intern:", internPayload);

      // Show success message
      alert(isEditMode ? "Intern updated successfully!" : "Intern added successfully!");

      // Navigate back to intern list
      navigate("/interns");
    } else {
      // Scroll to first error
      const firstError = document.querySelector(".error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="internNew">
      <Sidebar />
      <div className="internNewContainer">
        <Navbar />

        <div className="contentWrapper">
          <div className="pageHeader">
            <Link to="/interns" className="backLink">
              <ArrowBackIcon />
              Back to Interns
            </Link>
            <h1 className="title">
              {isEditMode ? "Edit Intern" : "Add New Intern"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="internForm">
            {/* Personal Information Section */}
            <div className="formSection">
              <h2 className="sectionTitle">Personal Information</h2>
              <div className="formGrid">
                <div className="formGroup">
                  <label htmlFor="name">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "error" : ""}
                    placeholder="Enter full name"
                  />
                  {errors.name && <span className="errorMessage">{errors.name}</span>}
                </div>

                <div className="formGroup">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    placeholder="intern@university.edu"
                  />
                  {errors.email && <span className="errorMessage">{errors.email}</span>}
                </div>

                <div className="formGroup">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "error" : ""}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <span className="errorMessage">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Education Information Section */}
            <div className="formSection">
              <h2 className="sectionTitle">Education Information</h2>
              <div className="formGrid">
                <div className="formGroup">
                  <label htmlFor="university">
                    University <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className={errors.university ? "error" : ""}
                    placeholder="Enter university name"
                  />
                  {errors.university && <span className="errorMessage">{errors.university}</span>}
                </div>

                <div className="formGroup">
                  <label htmlFor="major">
                    Major <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className={errors.major ? "error" : ""}
                    placeholder="e.g., Computer Science"
                  />
                  {errors.major && <span className="errorMessage">{errors.major}</span>}
                </div>

                <div className="formGroup">
                  <label htmlFor="year">
                    Year <span className="required">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={errors.year ? "error" : ""}
                  >
                    <option value="">Select year</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                  {errors.year && <span className="errorMessage">{errors.year}</span>}
                </div>

                <div className="formGroup">
                  <label htmlFor="gpa">
                    GPA <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="gpa"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    className={errors.gpa ? "error" : ""}
                    placeholder="3.75"
                    step="0.01"
                    min="0"
                    max="4.0"
                  />
                  {errors.gpa && <span className="errorMessage">{errors.gpa}</span>}
                </div>
              </div>

              <div className="formGroup fullWidth">
                <label htmlFor="skills">
                  Skills <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className={errors.skills ? "error" : ""}
                  placeholder="React, JavaScript, Python, Git (comma separated)"
                />
                <span className="helpText">Enter skills separated by commas</span>
                {errors.skills && <span className="errorMessage">{errors.skills}</span>}
              </div>
            </div>

            {/* Internship Details Section */}
            <div className="formSection">
              <h2 className="sectionTitle">Internship Details</h2>
              <div className="formGrid">
                <div className="formGroup">
                  <label htmlFor="stipend">
                    Monthly Stipend ($) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="stipend"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleChange}
                    className={errors.stipend ? "error" : ""}
                    placeholder="2500"
                    min="0"
                  />
                  {errors.stipend && <span className="errorMessage">{errors.stipend}</span>}
                </div>

                <div className="formGroup">
                  <label htmlFor="startDate">
                    Start Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={errors.startDate ? "error" : ""}
                  />
                  {errors.startDate && <span className="errorMessage">{errors.startDate}</span>}
                </div>

                <div className="formGroup">
                  <label htmlFor="endDate">
                    End Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={errors.endDate ? "error" : ""}
                  />
                  {errors.endDate && <span className="errorMessage">{errors.endDate}</span>}
                </div>

                <div className="formGroup">
                  <label htmlFor="mentor">
                    Assigned Mentor <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="mentor"
                    name="mentor"
                    value={formData.mentor}
                    onChange={handleChange}
                    className={errors.mentor ? "error" : ""}
                    placeholder="Enter mentor name"
                  />
                  {errors.mentor && <span className="errorMessage">{errors.mentor}</span>}
                </div>

                <div className="formGroup">
                  <label htmlFor="status">
                    Status <span className="required">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resume Upload Section */}
            <div className="formSection">
              <h2 className="sectionTitle">Resume Upload</h2>
              <div className="uploadSection">
                <label htmlFor="resume" className="uploadButton">
                  <CloudUploadIcon />
                  <span>Choose Resume File</span>
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                  />
                </label>
                {resumeFile && (
                  <div className="fileInfo">
                    <span className="fileName">{resumeFile.name}</span>
                    <span className="fileSize">({(resumeFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
                {errors.resume && <span className="errorMessage">{errors.resume}</span>}
                <span className="helpText">Accepted formats: PDF, DOC, DOCX (Max 5MB)</span>
              </div>
            </div>

            {/* Interview Notes Section */}
            <div className="formSection">
              <h2 className="sectionTitle">Interview Notes</h2>
              <div className="formGroup fullWidth">
                <label htmlFor="interviewNotes">Notes</label>
                <textarea
                  id="interviewNotes"
                  name="interviewNotes"
                  value={formData.interviewNotes}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Enter interview notes, observations, or comments..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="formActions">
              <button type="button" onClick={() => navigate("/interns")} className="cancelButton">
                Cancel
              </button>
              <button type="submit" className="submitButton">
                <SaveIcon />
                {isEditMode ? "Update Intern" : "Add Intern"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InternNew;
