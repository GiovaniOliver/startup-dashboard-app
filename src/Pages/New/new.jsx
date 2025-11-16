import "./new.scss";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { teamMembers, departments, roles } from "../../data/teamData";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const New = ({ title }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    salary: "",
    startDate: "",
    department: "",
    status: "Active",
    address: "",
    bio: "",
    skills: "",
    profilePicture: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const member = teamMembers.find((m) => m.id === parseInt(editId));
      if (member) {
        setFormData({
          name: member.name,
          role: member.role,
          email: member.email,
          phone: member.phone,
          salary: member.salary.toString(),
          startDate: member.startDate,
          department: member.department,
          status: member.status,
          address: member.address,
          bio: member.bio,
          skills: member.skills.join(", "),
          profilePicture: member.profilePicture,
        });
        setPreviewImage(member.profilePicture);
      }
    }
  }, [isEditMode, editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          profilePicture: "File size must be less than 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    // Salary validation
    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    } else if (isNaN(formData.salary) || parseFloat(formData.salary) < 0) {
      newErrors.salary = "Salary must be a positive number";
    }

    // Start date validation
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Process skills
    const skillsArray = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);

    const newMember = {
      id: isEditMode ? parseInt(editId) : Date.now(),
      ...formData,
      salary: parseFloat(formData.salary),
      skills: skillsArray,
      performanceScore: 0,
      tasksCompleted: 0,
      salaryHistory: [
        {
          year: new Date().getFullYear(),
          amount: parseFloat(formData.salary),
        },
      ],
    };

    // In a real application, you would save to backend here
    alert(
      isEditMode
        ? "Team member updated successfully!"
        : "Team member added successfully!"
    );

    navigate("/user");
  };

  const handleCancel = () => {
    navigate("/user");
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="newContent">
          <div className="top">
            <h1>{isEditMode ? "Edit Team Member" : title || "Add New Team Member"}</h1>
          </div>
          <div className="bottom">
            <div className="left">
              <div className="imageUpload">
                <img
                  src={
                    previewImage ||
                    "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
                  className="uploadImage"
                />
                <label htmlFor="file">
                  <CloudUploadIcon className="icon" />
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                {errors.profilePicture && (
                  <span className="error">{errors.profilePicture}</span>
                )}
              </div>
            </div>
            <div className="right">
              <form onSubmit={handleSubmit}>
                <div className="formRow">
                  <div className="formInput">
                    <label>
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={errors.name ? "error" : ""}
                    />
                    {errors.name && <span className="errorText">{errors.name}</span>}
                  </div>

                  <div className="formInput">
                    <label>
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@company.com"
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && <span className="errorText">{errors.email}</span>}
                  </div>
                </div>

                <div className="formRow">
                  <div className="formInput">
                    <label>
                      Phone <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && <span className="errorText">{errors.phone}</span>}
                  </div>

                  <div className="formInput">
                    <label>
                      Role <span className="required">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={errors.role ? "error" : ""}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {errors.role && <span className="errorText">{errors.role}</span>}
                  </div>
                </div>

                <div className="formRow">
                  <div className="formInput">
                    <label>
                      Department <span className="required">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={errors.department ? "error" : ""}
                    >
                      <option value="">Select Department</option>
                      {departments
                        .filter((dept) => dept !== "All")
                        .map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                    </select>
                    {errors.department && (
                      <span className="errorText">{errors.department}</span>
                    )}
                  </div>

                  <div className="formInput">
                    <label>
                      Salary <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="75000"
                      className={errors.salary ? "error" : ""}
                    />
                    {errors.salary && <span className="errorText">{errors.salary}</span>}
                  </div>
                </div>

                <div className="formRow">
                  <div className="formInput">
                    <label>
                      Start Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={errors.startDate ? "error" : ""}
                    />
                    {errors.startDate && (
                      <span className="errorText">{errors.startDate}</span>
                    )}
                  </div>

                  <div className="formInput">
                    <label>
                      Status <span className="required">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="formInput fullWidth">
                  <label>
                    Address <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, San Francisco, CA"
                    className={errors.address ? "error" : ""}
                  />
                  {errors.address && <span className="errorText">{errors.address}</span>}
                </div>

                <div className="formInput fullWidth">
                  <label>Skills / Expertise</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, JavaScript, Node.js (comma-separated)"
                  />
                  <small>Separate multiple skills with commas</small>
                </div>

                <div className="formInput fullWidth">
                  <label>Bio / Description</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Brief description of the team member..."
                    rows="4"
                  />
                </div>

                <div className="formActions">
                  <button type="submit" className="submitButton">
                    <SaveIcon />
                    {isEditMode ? "Update" : "Save"}
                  </button>
                  <button type="button" className="cancelButton" onClick={handleCancel}>
                    <CancelIcon />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;