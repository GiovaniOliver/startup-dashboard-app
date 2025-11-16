# Intern Management Module - Quick Reference

## File Locations

### Pages
```
src/Pages/InternList/
  ├── InternList.jsx
  └── InternList.scss

src/Pages/InternSingle/
  ├── InternSingle.jsx
  └── InternSingle.scss

src/Pages/InternNew/
  ├── InternNew.jsx
  └── InternNew.scss
```

### Components
```
src/Components/internComponents/
  ├── InternTaskCard.jsx
  ├── InternTaskCard.scss
  ├── InternPerformanceChart.jsx
  ├── InternPerformanceChart.scss
  ├── InternOnboardingProgress.jsx
  ├── InternOnboardingProgress.scss
  └── index.js
```

### Data
```
src/data/
  └── internData.js
```

## Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/interns` | InternList | Display all interns |
| `/interns/:internId` | InternSingle | View intern details |
| `/interns/new` | InternNew | Add new intern |
| `/interns/edit/:internId` | InternNew | Edit existing intern |

## Data Structure

```javascript
{
  id: Number,
  name: String,
  email: String,
  phone: String,
  university: String,
  major: String,
  year: String, // "Freshman", "Sophomore", "Junior", "Senior", "Graduate"
  gpa: Number,  // 0-4.0
  skills: Array[String],
  stipend: Number,
  startDate: String, // ISO date format
  endDate: String,   // ISO date format
  mentor: String,
  mentorId: Number,
  status: String, // "Active" or "Completed"
  avatar: String, // URL
  resumeUrl: String,
  interviewNotes: String,

  learningGoals: Array[{
    goal: String,
    progress: Number, // 0-100
    status: String    // "In Progress" or "Completed"
  }],

  assignedTasks: Array[{
    id: Number,
    title: String,
    status: String,  // "Pending", "In Progress", "Completed"
    dueDate: String  // ISO date format
  }],

  assignedProjects: Array[{
    id: Number,
    name: String,
    role: String,
    contribution: Number // 0-100 percentage
  }],

  attendanceRecord: {
    totalDays: Number,
    present: Number,
    absent: Number,
    late: Number,
    attendanceRate: Number // 0-100 percentage
  },

  evaluations: Array[{
    date: String,
    evaluator: String,
    technicalSkills: Number,  // 0-5
    communication: Number,    // 0-5
    teamwork: Number,        // 0-5
    initiative: Number,      // 0-5
    overallRating: Number,   // Average of above
    comments: String
  }],

  onboardingChecklist: Array[{
    item: String,
    completed: Boolean
  }]
}
```

## Component Usage Examples

### InternTaskCard
```jsx
import { InternTaskCard } from '../../Components/internComponents';

<InternTaskCard
  task={{
    id: 1,
    title: "Build User Profile Component",
    status: "Completed",
    dueDate: "2024-06-15"
  }}
  onStatusChange={(taskId, newStatus) => {
    // Handle status change
  }}
/>
```

### InternPerformanceChart
```jsx
import { InternPerformanceChart } from '../../Components/internComponents';

<InternPerformanceChart
  evaluations={intern.evaluations}
/>
```

### InternOnboardingProgress
```jsx
import { InternOnboardingProgress } from '../../Components/internComponents';

<InternOnboardingProgress
  checklist={intern.onboardingChecklist}
  onToggle={(index) => {
    // Handle checklist item toggle
  }}
/>
```

## Key Features by Page

### InternList
- Search interns by name, university, major
- Filter by university, major, status
- View statistics (total, active, stipend, GPA)
- Quick actions (view, edit, delete)
- Performance progress bars
- Add new intern button

### InternSingle
- Profile information
- Quick stats (attendance, performance, tasks)
- Learning goals with progress
- Assigned tasks list
- Assigned projects with contribution
- Onboarding checklist
- Performance evaluations with scores
- Interview notes
- Navigation (back, edit)

### InternNew
- Personal information form
- Education information
- Internship details
- Resume upload
- Interview notes
- Form validation
- Dual mode (add/edit)

## Styling Variables

Common colors used:
```scss
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Success: #28a745, #d4edda (bg), #155724 (text)
Warning: #ffc107, #fff3cd (bg), #856404 (text)
Info: #1976d2, #e3f2fd (bg)
Danger: #c62828, #ffebee (bg)
Text: #2c3e50 (primary), #495057 (secondary), #6c757d (muted)
Background: #f8f9fa
Border: #e9ecef
```

## Navigation Links

Sidebar links for intern module:
- "Intern List" → `/interns`
- "Add New Intern" → `/interns/new`

## API Integration Points (Future)

When connecting to backend:

1. **GET /api/interns** - Fetch all interns
2. **GET /api/interns/:id** - Fetch single intern
3. **POST /api/interns** - Create new intern
4. **PUT /api/interns/:id** - Update intern
5. **DELETE /api/interns/:id** - Delete intern
6. **POST /api/interns/:id/tasks** - Add task
7. **PUT /api/interns/:id/tasks/:taskId** - Update task
8. **POST /api/interns/:id/evaluations** - Add evaluation
9. **POST /api/interns/:id/resume** - Upload resume

## Sample Data Access

```javascript
import { internData, internStatistics } from '../data/internData';

// Get all interns
const allInterns = internData;

// Get active interns
const activeInterns = internData.filter(i => i.status === 'Active');

// Get intern by ID
const intern = internData.find(i => i.id === internId);

// Get statistics
const stats = internStatistics;
```

## Common Tasks

### Add a new field to intern data:
1. Update `src/data/internData.js` - add field to sample data
2. Update `src/Pages/InternNew/InternNew.jsx` - add form field
3. Update `src/Pages/InternSingle/InternSingle.jsx` - display new field
4. Update `src/Pages/InternList/InternList.jsx` - optionally add to table

### Create a new intern-related component:
1. Create component file in `src/Components/internComponents/`
2. Create SCSS file in same directory
3. Export from `src/Components/internComponents/index.js`
4. Import and use in pages

### Add a new route:
1. Update `src/App.js` - add Route inside `/interns` path
2. Create page component if needed
3. Add navigation link in sidebar if needed

## Testing Checklist

- [ ] Navigate to /interns - list displays
- [ ] Search functionality works
- [ ] Filters work (university, major, status)
- [ ] Click on intern row - navigates to detail page
- [ ] Detail page shows all information correctly
- [ ] Click "Edit" - navigates to edit form with populated data
- [ ] Click "Add New Intern" - shows empty form
- [ ] Submit form with missing required fields - shows errors
- [ ] Submit valid form - shows success (currently console log)
- [ ] Upload resume - accepts PDF/DOC/DOCX, rejects others
- [ ] Learning goals progress bars display correctly
- [ ] Performance evaluations display with correct scores
- [ ] Onboarding checklist shows completion status
- [ ] Sidebar links navigate correctly

## Dependencies Used

- React Router DOM - for routing and navigation
- Material-UI Icons - for consistent iconography
- SCSS - for styling with nesting

No additional dependencies needed!
