# Quick Reference - Projects API

## 🚀 Setup (One-time)

```bash
# 1. Run migrations
mysql -u root -p feature_flow < lib/migrations/create_projects_table.sql
mysql -u root -p feature_flow < lib/migrations/seed_projects_data.sql

# 2. Start server
npm run dev
```

## 📡 API Endpoints Cheat Sheet

### Projects
```bash
# List all projects
GET /api/projects
GET /api/projects?status=on-track&priority=high&search=search_term

# Create project
POST /api/projects
Body: { name, description, status?, priority?, category?, start_date?, end_date?, member_ids? }

# Get single project
GET /api/projects/1

# Update project
PUT /api/projects/1
Body: { name?, description?, status?, priority?, progress?, ... }

# Delete project
DELETE /api/projects/1
```

### Dashboard
```bash
# Get dashboard data
GET /api/projects/1/dashboard
# Returns: project, upcomingTasks, sprintProgress, teamMembers, recentActivity
```

### Statistics
```bash
# Get overall stats
GET /api/projects/stats
# Returns: overall, byStatus, byPriority, byTeam, recentProjects
```

### Members
```bash
# List members
GET /api/projects/1/members

# Add member
POST /api/projects/1/members
Body: { user_id, role: "owner"|"admin"|"member"|"viewer" }

# Remove member
DELETE /api/projects/1/members?user_id=5
```

### Insights
```bash
# List insights
GET /api/projects/1/insights

# Add insight
POST /api/projects/1/insights
Body: { insight_type: "risk"|"suggestion"|"milestone"|"alert", message, severity: "low"|"medium"|"high" }
```

## 💻 Frontend Code Snippets

### Fetch Projects with Filters
```typescript
const response = await fetch('/api/projects?status=on-track&priority=high');
const { projects } = await response.json();
```

### Create New Project
```typescript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Project',
    description: 'Description',
    status: 'open',
    priority: 'high',
    start_date: '2024-11-01',
    end_date: '2024-12-31',
    member_ids: [2, 3, 4]
  })
});
const { project } = await response.json();
```

### Get Dashboard Data
```typescript
const response = await fetch('/api/projects/1/dashboard');
const {
  project,
  upcomingTasks,
  sprintProgress,
  teamMembers,
  recentActivity
} = await response.json();
```

### Update Project
```typescript
const response = await fetch('/api/projects/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'on-track',
    progress: 75
  })
});
const { project } = await response.json();
```

### Add Team Member
```typescript
const response = await fetch('/api/projects/1/members', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 5,
    role: 'member'
  })
});
const { member } = await response.json();
```

## 🎨 Helper Functions

```typescript
import {
  calculateProjectProgress,
  getStatusColor,
  getPriorityColor,
  formatDateRange,
  getDaysRemaining,
  getProjectHealth,
  sortProjects,
  filterProjectsBySearch
} from '@/lib/projectHelpers';

// Calculate progress
const progress = calculateProjectProgress(totalTasks, completedTasks);

// Get status color class
const colorClass = getStatusColor('on-track'); // "bg-green-100 text-green-700"

// Format date range
const dateText = formatDateRange('2024-10-01', '2024-12-31'); // "Oct 1 - Dec 31"

// Get days remaining
const days = getDaysRemaining('2024-12-31'); // number or null

// Get project health
const health = getProjectHealth(project); // "healthy" | "warning" | "critical"

// Sort projects
const sorted = sortProjects(projects, 'priority', 'desc');

// Filter by search
const filtered = filterProjectsBySearch(projects, 'search term');
```

## 📊 Data Types

### Project Status
```typescript
'open' | 'at-risk' | 'blocked' | 'on-track'
```

### Project Priority
```typescript
'low' | 'medium' | 'high' | 'urgent'
```

### Member Roles
```typescript
'owner' | 'admin' | 'member' | 'viewer'
```

### Insight Types
```typescript
'risk' | 'suggestion' | 'milestone' | 'alert'
```

## 🎯 Common Use Cases

### Display Project List
```typescript
const [projects, setProjects] = useState([]);
const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

useEffect(() => {
  const fetchProjects = async () => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    
    const response = await fetch(`/api/projects?${params}`);
    const { projects } = await response.json();
    setProjects(projects);
  };
  
  fetchProjects();
}, [filters]);
```

### Display Project Dashboard
```typescript
const [dashboardData, setDashboardData] = useState(null);

useEffect(() => {
  const fetchDashboard = async () => {
    const response = await fetch(`/api/projects/${projectId}/dashboard`);
    const data = await response.json();
    setDashboardData(data);
  };
  
  fetchDashboard();
}, [projectId]);

// Use the data
const { project, upcomingTasks, sprintProgress, teamMembers } = dashboardData || {};
```

### Create Project Form
```typescript
const handleSubmit = async (formData) => {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  if (response.ok) {
    const { project } = await response.json();
    // Redirect or update UI
  } else {
    const { error } = await response.json();
    // Show error message
  }
};
```

## 🔍 Debugging

### Check Database
```sql
-- Verify tables exist
SHOW TABLES;

-- Check projects
SELECT * FROM projects;

-- Check members
SELECT * FROM project_members;

-- Check insights
SELECT * FROM project_insights;
```

### Test API
```bash
# Using curl
curl http://localhost:3000/api/projects
curl http://localhost:3000/api/projects/1
curl http://localhost:3000/api/projects/1/dashboard
curl http://localhost:3000/api/projects/stats

# Using browser
http://localhost:3000/api/projects
http://localhost:3000/api/projects/1/dashboard
```

## ⚠️ Common Errors

### "Failed to fetch projects"
- Check database connection in `.env.local`
- Verify MySQL server is running
- Check if tables exist

### "Project not found"
- Verify project ID exists in database
- Check if project was deleted

### "User is already a member"
- User is already assigned to the project
- Check existing members first

## 📝 Notes

- All dates use ISO 8601 format (YYYY-MM-DD)
- Progress is 0-100 integer
- Member count includes all roles
- Task count includes all statuses
- Upcoming tasks are limited to next 7 days
- Recent activity shows last 10 items
- Statistics are calculated in real-time

## 🔗 Related Files

- Models: `models/project.ts`
- Helpers: `lib/projectHelpers.ts`
- Database: `lib/db.ts`
- Migrations: `lib/migrations/create_projects_table.sql`
- API Docs: `app/api/projects/README.md`
- Setup Guide: `SETUP_GUIDE.md`
- Full Summary: `PROJECT_BACKEND_SUMMARY.md`
