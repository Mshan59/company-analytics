# API Endpoints Reference

## Profile Endpoints

### GET /api/profile
Fetch the current authenticated user's profile.

**Authentication**: Required (JWT token in cookie)

**Response**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "phone": "+1 234-567-8900",
  "address": "123 Main St, City, State 12345",
  "firm": "Doe & Associates",
  "position": "Senior Attorney",
  "specialty": "Corporate Law",
  "barNumber": "NY123456",
  "yearsExperience": 10,
  "education": "J.D., Harvard Law School",
  "bio": "Experienced attorney specializing in corporate law..."
}
```

**Error Responses**:
- `401 Unauthorized` - No token or invalid token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Database error

---

### PUT /api/profile
Update the current authenticated user's profile.

**Authentication**: Required (JWT token in cookie)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 234-567-8900",
  "address": "123 Main St, City, State 12345",
  "firm": "Doe & Associates",
  "position": "Senior Attorney",
  "specialty": "Corporate Law",
  "barNumber": "NY123456",
  "yearsExperience": 10,
  "education": "J.D., Harvard Law School",
  "bio": "Experienced attorney specializing in corporate law..."
}
```

**Required Fields**:
- `name` (string)
- `email` (string)

**Optional Fields**:
- `phone` (string)
- `address` (string)
- `firm` (string)
- `position` (string)
- `specialty` (string)
- `barNumber` (string)
- `yearsExperience` (number)
- `education` (string)
- `bio` (string)

**Response**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "phone": "+1 234-567-8900",
  "address": "123 Main St, City, State 12345",
  "firm": "Doe & Associates",
  "position": "Senior Attorney",
  "specialty": "Corporate Law",
  "barNumber": "NY123456",
  "yearsExperience": 10,
  "education": "J.D., Harvard Law School",
  "bio": "Experienced attorney specializing in corporate law..."
}
```

**Error Responses**:
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - No token or invalid token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Database error

---

### GET /api/profile/stats
Fetch statistics for the current authenticated user's profile.

**Authentication**: Required (JWT token in cookie)

**Response**:
```json
{
  "activeCases": 12,
  "completedCases": 87,
  "successRate": "92%",
  "hoursBilled": 1840
}
```

**Statistics Calculation**:
- `activeCases`: Count of projects with status 'active' or 'in_progress'
- `completedCases`: Count of projects with status 'completed'
- `successRate`: Percentage of completed cases (completedCases / totalCases * 100)
- `hoursBilled`: Sum of estimated_hours from all tasks in user's projects

**Error Responses**:
- `401 Unauthorized` - No token or invalid token
- `500 Internal Server Error` - Database error

---

## Usage Examples

### JavaScript/TypeScript (Fetch API)

#### Get Profile
```typescript
const response = await fetch('/api/profile', {
  credentials: 'include'
});
const profile = await response.json();
```

#### Update Profile
```typescript
const response = await fetch('/api/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234-567-8900',
    // ... other fields
  })
});
const updatedProfile = await response.json();
```

#### Get Profile Stats
```typescript
const response = await fetch('/api/profile/stats', {
  credentials: 'include'
});
const stats = await response.json();
```

### Using the API Utility Functions

```typescript
import { fetchProfile, updateProfile, fetchProfileStats } from '@/lib/api/profile';

// Get profile
const profile = await fetchProfile();

// Update profile
const updatedProfile = await updateProfile({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 234-567-8900',
});

// Get stats
const stats = await fetchProfileStats();
```

---

## Authentication

All profile endpoints require authentication via JWT token stored in cookies. The token is automatically sent with requests when using `credentials: 'include'`.

### Token Format
The JWT token contains the following payload:
```json
{
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

### How Authentication Works
1. User logs in via `/api/auth/login`
2. Server generates JWT token and sets it as a cookie
3. Client includes cookie in subsequent requests
4. Server verifies token and extracts user ID
5. API endpoints use user ID to fetch/update data

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

### Common Error Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (database or server error)

### Example Error Handling
```typescript
try {
  const response = await fetch('/api/profile', {
    credentials: 'include'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch profile');
  }
  
  const profile = await response.json();
  // Use profile data
} catch (error) {
  console.error('Error:', error.message);
  // Handle error (show message to user, etc.)
}
```
