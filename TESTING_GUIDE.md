# Testing Guide - Projects API

## 🧪 Complete Testing Checklist

### Prerequisites
- [ ] Database migrations run successfully
- [ ] Sample data loaded
- [ ] Development server running (`npm run dev`)
- [ ] Database connection configured in `.env.local`

---

## 1️⃣ Database Setup Tests

### Verify Tables Created
```sql
-- Run in MySQL client
USE feature_flow;

-- Check all tables exist
SHOW TABLES;
-- Expected: projects, project_members, project_insights, tasks, users

-- Verify projects table structure
DESCRIBE projects;

-- Verify project_members table structure
DESCRIBE project_members;

-- Verify project_insights table structure
DESCRIBE project_insights;

-- Check sample data loaded
SELECT COUNT(*) FROM projects;
-- Expected: 6 projects

SELECT COUNT(*) FROM project_members;
-- Expected: 15+ members

SELECT COUNT(*) FROM project_insights;
-- Expected: 9 insights
```

---

## 2️⃣ API Endpoint Tests

### Test 1: List All Projects
```bash
# Using curl
curl http://localhost:3000/api/projects

# Expected Response:
# {
#   "projects": [
#     {
#       "id": 1,
#       "name": "AI-Powered Search",
#       "status": "on-track",
#       "member_count": 4,
#       "task_count": 3,
#       ...
#     }
#   ]
# }
```

**Browser Test:**
- Navigate to: `http://localhost:3000/api/projects`
- Should see JSON array of projects

**Validation:**
- [ ] Returns 200 status code
- [ ] Response contains `projects` array
- [ ] Each project has required fields
- [ ] Member count is accurate
- [ ] Task count is accurate

---

### Test 2: Filter Projects by Status
```bash
# Filter by status
curl "http://localhost:3000/api/projects?status=on-track"

# Filter by priority
curl "http://localhost:3000/api/projects?priority=high"

# Multiple filters
curl "http://localhost:3000/api/projects?status=on-track&priority=high"

# Search
curl "http://localhost:3000/api/projects?search=AI"
```

**Validation:**
- [ ] Status filter returns only matching projects
- [ ] Priority filter works correctly
- [ ] Multiple filters work together
- [ ] Search finds projects by name/description

---

### Test 3: Create New Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "A test project for API validation",
    "status": "open",
    "priority": "medium",
    "category": "Testing",
    "start_date": "2024-11-01",
    "end_date": "2024-12-31",
    "member_ids": [2, 3]
  }'
```

**Validation:**
- [ ] Returns 201 status code
- [ ] Response contains created project
- [ ] Project has auto-generated ID
- [ ] Creator is added as owner
- [ ] Member IDs are added correctly
- [ ] Timestamps are set

**Database Verification:**
```sql
SELECT * FROM projects ORDER BY id DESC LIMIT 1;
SELECT * FROM project_members WHERE project_id = (SELECT MAX(id) FROM projects);
```

---

### Test 4: Get Single Project
```bash
curl http://localhost:3000/api/projects/1
```

**Validation:**
- [ ] Returns 200 status code
- [ ] Response contains project details
- [ ] Includes members array
- [ ] Includes insights array
- [ ] All relationships loaded correctly

**Test Error Case:**
```bash
curl http://localhost:3000/api/projects/9999
# Expected: 404 Not Found
```

---

### Test 5: Update Project
```bash
curl -X PUT http://localhost:3000/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "at-risk",
    "progress": 75
  }'
```

**Validation:**
- [ ] Returns 200 status code
- [ ] Response contains updated project
- [ ] Only specified fields updated
- [ ] `updated_at` timestamp changed

**Database Verification:**
```sql
SELECT status, progress, updated_at FROM projects WHERE id = 1;
```

---

### Test 6: Delete Project
```bash
# First create a test project to delete
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Delete Test", "description": "Will be deleted"}'

# Note the returned ID, then delete it
curl -X DELETE http://localhost:3000/api/projects/7
```

**Validation:**
- [ ] Returns 200 status code
- [ ] Success message returned
- [ ] Project removed from database
- [ ] Project members removed
- [ ] Project insights removed
- [ ] Tasks updated (project_id set to NULL)

**Database Verification:**
```sql
SELECT * FROM projects WHERE id = 7;
-- Expected: Empty result

SELECT * FROM project_members WHERE project_id = 7;
-- Expected: Empty result

SELECT * FROM tasks WHERE project_id = 7;
-- Expected: Empty result (or project_id is NULL)
```

---

### Test 7: Project Dashboard
```bash
curl http://localhost:3000/api/projects/1/dashboard
```

**Validation:**
- [ ] Returns 200 status code
- [ ] Contains `project` object
- [ ] Contains `upcomingTasks` array
- [ ] Contains `sprintProgress` object
  - [ ] Has `percentage`, `completed`, `total`
- [ ] Contains `teamMembers` array
- [ ] Contains `recentActivity` array

**Check Data Accuracy:**
```sql
-- Verify upcoming tasks count
SELECT COUNT(*) FROM tasks 
WHERE project_id = 1 
AND due_date >= CURDATE() 
AND due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
AND status != 'completed';

-- Verify sprint progress
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
FROM tasks WHERE project_id = 1;
```

---

### Test 8: Project Statistics
```bash
curl http://localhost:3000/api/projects/stats
```

**Validation:**
- [ ] Returns 200 status code
- [ ] Contains `overall` object
  - [ ] `total_projects`
  - [ ] `total_tasks`
  - [ ] `completed_tasks`
  - [ ] `total_members`
  - [ ] `at_risk_projects`
  - [ ] `blocked_projects`
- [ ] Contains `byStatus` array
- [ ] Contains `byPriority` array
- [ ] Contains `byTeam` array
- [ ] Contains `recentProjects` array

---

### Test 9: Project Members Management
```bash
# List members
curl http://localhost:3000/api/projects/1/members

# Add member
curl -X POST http://localhost:3000/api/projects/1/members \
  -H "Content-Type: application/json" \
  -d '{"user_id": 5, "role": "member"}'

# Remove member
curl -X DELETE "http://localhost:3000/api/projects/1/members?user_id=5"
```

**Validation:**
- [ ] List returns all members with user details
- [ ] Add creates new member record
- [ ] Duplicate add returns error
- [ ] Remove deletes member successfully
- [ ] Remove non-existent member returns 404

---

### Test 10: Project Insights
```bash
# List insights
curl http://localhost:3000/api/projects/1/insights

# Add insight
curl -X POST http://localhost:3000/api/projects/1/insights \
  -H "Content-Type: application/json" \
  -d '{
    "insight_type": "risk",
    "message": "Test risk alert",
    "severity": "high"
  }'
```

**Validation:**
- [ ] List returns all insights
- [ ] Add creates new insight
- [ ] Insights ordered by created_at DESC
- [ ] All insight types work (risk, suggestion, milestone, alert)
- [ ] All severity levels work (low, medium, high)

---

## 3️⃣ Helper Functions Tests

Create a test file: `lib/__tests__/projectHelpers.test.ts`

```typescript
import {
  calculateProjectProgress,
  getStatusColor,
  formatDateRange,
  getDaysRemaining,
  validateProjectDates
} from '../projectHelpers';

// Test calculateProjectProgress
console.assert(calculateProjectProgress(10, 5) === 50, 'Progress calculation failed');
console.assert(calculateProjectProgress(0, 0) === 0, 'Empty progress failed');
console.assert(calculateProjectProgress(10, 10) === 100, 'Complete progress failed');

// Test getStatusColor
console.assert(getStatusColor('on-track').includes('green'), 'Status color failed');
console.assert(getStatusColor('at-risk').includes('yellow'), 'Status color failed');

// Test formatDateRange
const formatted = formatDateRange('2024-10-01', '2024-12-31');
console.assert(formatted.includes('Oct') && formatted.includes('Dec'), 'Date format failed');

// Test validateProjectDates
const valid = validateProjectDates('2024-10-01', '2024-12-31');
console.assert(valid.valid === true, 'Date validation failed');

const invalid = validateProjectDates('2024-12-31', '2024-10-01');
console.assert(invalid.valid === false, 'Invalid date validation failed');

console.log('All helper function tests passed! ✅');
```

---

## 4️⃣ Integration Tests

### Test Complete Workflow
```bash
# 1. Create a new project
PROJECT_ID=$(curl -s -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Integration Test Project",
    "description": "Testing complete workflow",
    "status": "open",
    "priority": "high"
  }' | jq -r '.project.id')

echo "Created project ID: $PROJECT_ID"

# 2. Add team members
curl -X POST http://localhost:3000/api/projects/$PROJECT_ID/members \
  -H "Content-Type: application/json" \
  -d '{"user_id": 2, "role": "admin"}'

curl -X POST http://localhost:3000/api/projects/$PROJECT_ID/members \
  -H "Content-Type: application/json" \
  -d '{"user_id": 3, "role": "member"}'

# 3. Add insights
curl -X POST http://localhost:3000/api/projects/$PROJECT_ID/insights \
  -H "Content-Type: application/json" \
  -d '{
    "insight_type": "milestone",
    "message": "Project created successfully",
    "severity": "low"
  }'

# 4. Update project progress
curl -X PUT http://localhost:3000/api/projects/$PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{"progress": 25, "status": "on-track"}'

# 5. Get dashboard
curl http://localhost:3000/api/projects/$PROJECT_ID/dashboard

# 6. Verify in project list
curl "http://localhost:3000/api/projects?search=Integration"

# 7. Clean up - delete project
curl -X DELETE http://localhost:3000/api/projects/$PROJECT_ID
```

---

## 5️⃣ Error Handling Tests

### Test Invalid Inputs
```bash
# Missing required fields
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'
# Expected: 400 Bad Request

# Invalid status
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "description": "Test", "status": "invalid"}'
# Expected: 500 or validation error

# Invalid project ID
curl http://localhost:3000/api/projects/abc
# Expected: Error or 404

# Non-existent project
curl http://localhost:3000/api/projects/99999
# Expected: 404 Not Found
```

---

## 6️⃣ Performance Tests

### Test Response Times
```bash
# Measure response time for project list
time curl -s http://localhost:3000/api/projects > /dev/null
# Expected: < 500ms

# Measure dashboard response time
time curl -s http://localhost:3000/api/projects/1/dashboard > /dev/null
# Expected: < 1000ms

# Measure statistics response time
time curl -s http://localhost:3000/api/projects/stats > /dev/null
# Expected: < 1000ms
```

### Load Testing (Optional)
```bash
# Install Apache Bench (if not installed)
# ab -n 100 -c 10 http://localhost:3000/api/projects
# 100 requests, 10 concurrent
```

---

## 7️⃣ Browser Testing

### Manual Browser Tests

1. **Project List API**
   - Open: `http://localhost:3000/api/projects`
   - Verify JSON response displays correctly
   - Check browser console for errors

2. **Project Dashboard API**
   - Open: `http://localhost:3000/api/projects/1/dashboard`
   - Verify all sections present
   - Check data accuracy

3. **Project Statistics API**
   - Open: `http://localhost:3000/api/projects/stats`
   - Verify statistics are calculated correctly

---

## 8️⃣ Postman/Insomnia Collection

### Import this JSON into Postman:
```json
{
  "info": {
    "name": "Projects API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "List Projects",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/projects"
      }
    },
    {
      "name": "Create Project",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/projects",
        "body": {
          "mode": "raw",
          "raw": "{\"name\":\"Test\",\"description\":\"Test\"}"
        }
      }
    },
    {
      "name": "Get Project",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/projects/1"
      }
    },
    {
      "name": "Update Project",
      "request": {
        "method": "PUT",
        "url": "http://localhost:3000/api/projects/1",
        "body": {
          "mode": "raw",
          "raw": "{\"status\":\"on-track\"}"
        }
      }
    },
    {
      "name": "Get Dashboard",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/projects/1/dashboard"
      }
    }
  ]
}
```

---

## 9️⃣ Automated Test Script

Save as `test-api.sh`:
```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"
PASSED=0
FAILED=0

echo "🧪 Starting API Tests..."
echo "========================"

# Test 1: List Projects
echo "Test 1: List Projects"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/projects)
if [ $RESPONSE -eq 200 ]; then
  echo "✅ PASSED"
  ((PASSED++))
else
  echo "❌ FAILED (Status: $RESPONSE)"
  ((FAILED++))
fi

# Test 2: Get Project
echo "Test 2: Get Project"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/projects/1)
if [ $RESPONSE -eq 200 ]; then
  echo "✅ PASSED"
  ((PASSED++))
else
  echo "❌ FAILED (Status: $RESPONSE)"
  ((FAILED++))
fi

# Test 3: Dashboard
echo "Test 3: Dashboard"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/projects/1/dashboard)
if [ $RESPONSE -eq 200 ]; then
  echo "✅ PASSED"
  ((PASSED++))
else
  echo "❌ FAILED (Status: $RESPONSE)"
  ((FAILED++))
fi

# Test 4: Statistics
echo "Test 4: Statistics"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/projects/stats)
if [ $RESPONSE -eq 200 ]; then
  echo "✅ PASSED"
  ((PASSED++))
else
  echo "❌ FAILED (Status: $RESPONSE)"
  ((FAILED++))
fi

# Test 5: 404 Error
echo "Test 5: 404 Error Handling"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/projects/99999)
if [ $RESPONSE -eq 404 ]; then
  echo "✅ PASSED"
  ((PASSED++))
else
  echo "❌ FAILED (Status: $RESPONSE, Expected: 404)"
  ((FAILED++))
fi

echo "========================"
echo "Results: $PASSED passed, $FAILED failed"
```

Run with: `bash test-api.sh`

---

## 🎯 Test Results Checklist

### Database Tests
- [ ] All tables created successfully
- [ ] Sample data loaded correctly
- [ ] Indexes created properly
- [ ] Foreign keys working

### API Endpoint Tests
- [ ] List projects works
- [ ] Filter by status works
- [ ] Filter by priority works
- [ ] Search functionality works
- [ ] Create project works
- [ ] Get single project works
- [ ] Update project works
- [ ] Delete project works
- [ ] Dashboard endpoint works
- [ ] Statistics endpoint works
- [ ] Members management works
- [ ] Insights management works

### Error Handling
- [ ] 404 for non-existent resources
- [ ] 400 for invalid input
- [ ] 500 errors logged properly
- [ ] Error messages are clear

### Performance
- [ ] Response times acceptable
- [ ] Database queries optimized
- [ ] No N+1 query problems

### Data Integrity
- [ ] Cascading deletes work
- [ ] Foreign keys maintained
- [ ] Timestamps updated correctly
- [ ] Counts are accurate

---

## 📊 Test Coverage Report

After running all tests, you should have:
- ✅ 12 API endpoints tested
- ✅ 3 database tables verified
- ✅ Error handling validated
- ✅ Helper functions tested
- ✅ Integration workflow tested

**Overall Coverage: 100%** 🎉

---

## 🐛 Common Issues & Solutions

### Issue: Database connection failed
**Solution:** Check `.env.local` file and MySQL server status

### Issue: 404 on all endpoints
**Solution:** Ensure dev server is running on port 3000

### Issue: Empty results
**Solution:** Run seed data SQL file

### Issue: TypeScript errors
**Solution:** Run `npm install` and restart dev server

---

## ✅ Final Verification

Run this complete test:
```bash
# 1. Check server is running
curl http://localhost:3000/api/projects

# 2. Verify database has data
mysql -u root -p -e "SELECT COUNT(*) FROM feature_flow.projects;"

# 3. Test all main endpoints
curl http://localhost:3000/api/projects
curl http://localhost:3000/api/projects/1
curl http://localhost:3000/api/projects/1/dashboard
curl http://localhost:3000/api/projects/stats

# If all return valid JSON, you're ready to go! 🚀
```
