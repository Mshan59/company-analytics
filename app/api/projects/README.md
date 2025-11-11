# Projects API Documentation

This document describes the backend API endpoints for the project management system.

## Database Setup

Before using the API, run the SQL migration file to create the required tables:

```sql
-- Run this file: lib/migrations/create_projects_table.sql
```

This will create the following tables:
- `projects` - Main project information
- `project_members` - Project team members and their roles
- `project_insights` - AI-generated insights and alerts for projects

## API Endpoints

### 1. Projects List

#### GET `/api/projects`
Fetch all projects with optional filters.

**Query Parameters:**
- `status` - Filter by status (open, at-risk, blocked, on-track)
- `priority` - Filter by priority (low, medium, high, urgent)
- `team_id` - Filter by team ID
- `search` - Search in project name and description

**Response:**
```json
{
  "projects": [
    {
      "id": 1,
      "name": "AI-Powered Search",
      "description": "E-Commerce Platform",
      "status": "on-track",
      "priority": "high",
      "category": "Development",
      "start_date": "2024-10-01",
      "end_date": "2024-12-15",
      "created_by": 1,
      "created_by_name": "John Doe",
      "team_id": 1,
      "progress": 45,
      "member_count": 5,
      "task_count": 12,
      "completed_tasks": 5,
      "created_at": "2024-10-01T00:00:00.000Z",
      "updated_at": "2024-11-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/projects`
Create a new project.

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "status": "open",
  "priority": "medium",
  "category": "Development",
  "start_date": "2024-11-01",
  "end_date": "2024-12-31",
  "team_id": 1,
  "member_ids": [2, 3, 4]
}
```

**Response:** (201 Created)
```json
{
  "project": {
    "id": 2,
    "name": "New Project",
    ...
  }
}
```

### 2. Single Project

#### GET `/api/projects/[id]`
Fetch a single project with full details including members and insights.

**Response:**
```json
{
  "project": {
    "id": 1,
    "name": "AI-Powered Search",
    ...
    "members": [
      {
        "id": 1,
        "project_id": 1,
        "user_id": 1,
        "role": "owner",
        "user_name": "John Doe",
        "user_email": "john@example.com",
        "joined_at": "2024-10-01T00:00:00.000Z"
      }
    ],
    "insights": [
      {
        "id": 1,
        "project_id": 1,
        "insight_type": "risk",
        "message": "Project deadline approaching",
        "severity": "high",
        "created_at": "2024-11-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### PUT `/api/projects/[id]`
Update a project.

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "status": "on-track",
  "progress": 60
}
```

#### DELETE `/api/projects/[id]`
Delete a project.

**Response:**
```json
{
  "message": "Project deleted successfully"
}
```

### 3. Project Dashboard

#### GET `/api/projects/[id]/dashboard`
Fetch comprehensive dashboard data for a project.

**Response:**
```json
{
  "project": {
    "id": 1,
    "name": "AI-Powered Search",
    ...
  },
  "upcomingTasks": [
    {
      "id": 1,
      "title": "UI Design Review",
      "due_date": "2024-11-05",
      "status": "pending",
      "priority": "high"
    }
  ],
  "sprintProgress": {
    "percentage": 68,
    "completed": 17,
    "total": 25
  },
  "teamMembers": [...],
  "recentActivity": [
    {
      "type": "task_created",
      "message": "Task \"API Integration\" was created",
      "timestamp": "2024-11-01T10:30:00.000Z"
    }
  ]
}
```

### 4. Project Members

#### GET `/api/projects/[id]/members`
Fetch all members of a project.

#### POST `/api/projects/[id]/members`
Add a member to a project.

**Request Body:**
```json
{
  "user_id": 5,
  "role": "member"
}
```

#### DELETE `/api/projects/[id]/members?user_id=5`
Remove a member from a project.

### 5. Project Insights

#### GET `/api/projects/[id]/insights`
Fetch all insights for a project.

#### POST `/api/projects/[id]/insights`
Add an insight to a project.

**Request Body:**
```json
{
  "insight_type": "risk",
  "message": "Budget overrun detected",
  "severity": "high"
}
```

### 6. Project Statistics

#### GET `/api/projects/stats`
Fetch overall project statistics for the home page.

**Response:**
```json
{
  "overall": {
    "total_projects": 15,
    "total_tasks": 120,
    "completed_tasks": 75,
    "total_members": 25,
    "at_risk_projects": 2,
    "blocked_projects": 1
  },
  "byStatus": [
    { "status": "open", "count": 5 },
    { "status": "on-track", "count": 7 },
    { "status": "at-risk", "count": 2 },
    { "status": "blocked", "count": 1 }
  ],
  "byPriority": [
    { "priority": "low", "count": 3 },
    { "priority": "medium", "count": 6 },
    { "priority": "high", "count": 4 },
    { "priority": "urgent", "count": 2 }
  ],
  "byTeam": [
    { "team_id": 1, "project_count": 5 },
    { "team_id": 2, "project_count": 7 }
  ],
  "recentProjects": [...]
}
```

## Data Models

### Project Status Values
- `open` - Project is open and active
- `on-track` - Project is progressing well
- `at-risk` - Project has some risks
- `blocked` - Project is blocked

### Project Priority Values
- `low`
- `medium`
- `high`
- `urgent`

### Member Role Values
- `owner` - Project owner (full control)
- `admin` - Project admin (can manage members)
- `member` - Regular member
- `viewer` - Read-only access

### Insight Types
- `risk` - Risk alert
- `suggestion` - AI suggestion
- `milestone` - Milestone notification
- `alert` - General alert

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Notes

1. Authentication is currently using a default `created_by` value of 1. In production, this should be extracted from JWT tokens.
2. All date fields use ISO 8601 format.
3. The API uses MySQL connection pooling for better performance.
4. Foreign key relationships are maintained through manual cleanup in DELETE operations.
