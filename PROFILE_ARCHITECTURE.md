# Profile Feature Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Profile Page Component (app/profile/page.tsx)               │  │
│  │                                                               │  │
│  │  State Management:                                            │  │
│  │  • userData (profile data)                                    │  │
│  │  • stats (statistics)                                         │  │
│  │  • loading, saving, error states                             │  │
│  │                                                               │  │
│  │  Features:                                                    │  │
│  │  • View/Edit toggle                                           │  │
│  │  • Form validation                                            │  │
│  │  • Real-time updates                                          │  │
│  │  • Error handling                                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓ ↑                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  API Utilities (lib/api/profile.ts)                          │  │
│  │                                                               │  │
│  │  • fetchProfile()                                             │  │
│  │  • updateProfile()                                            │  │
│  │  • fetchProfileStats()                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                    HTTP Requests (with JWT cookie)
                                │
┌───────────────────────────────┴───────────────────────────────────────┐
│                          MIDDLEWARE LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Next.js Middleware (middleware.ts)                          │  │
│  │                                                               │  │
│  │  • Verify JWT token                                           │  │
│  │  • Protect /profile route                                     │  │
│  │  • Redirect to login if unauthorized                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │
┌───────────────────────────────┴───────────────────────────────────────┐
│                          API LAYER (Backend)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  GET /api/profile (app/api/profile/route.ts)                 │  │
│  │                                                               │  │
│  │  1. Verify JWT token from cookie                             │  │
│  │  2. Extract userId from token payload                        │  │
│  │  3. Query database for user profile                          │  │
│  │  4. Return profile data                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  PUT /api/profile (app/api/profile/route.ts)                 │  │
│  │                                                               │  │
│  │  1. Verify JWT token from cookie                             │  │
│  │  2. Extract userId from token payload                        │  │
│  │  3. Validate request body                                     │  │
│  │  4. Update database with new profile data                    │  │
│  │  5. Return updated profile data                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  GET /api/profile/stats (app/api/profile/stats/route.ts)     │  │
│  │                                                               │  │
│  │  1. Verify JWT token from cookie                             │  │
│  │  2. Extract userId from token payload                        │  │
│  │  3. Query database for:                                       │  │
│  │     • Active cases count                                      │  │
│  │     • Completed cases count                                   │  │
│  │     • Calculate success rate                                  │  │
│  │     • Sum hours billed                                        │  │
│  │  4. Return statistics object                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Authentication Utilities (lib/auth.ts)                       │  │
│  │                                                               │  │
│  │  • verifyToken()                                              │  │
│  │  • getUserFromToken()                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                    Database Queries (SQL)
                                │
┌───────────────────────────────┴───────────────────────────────────────┐
│                          DATABASE LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  MySQL Database Connection (lib/db.ts)                        │  │
│  │                                                               │  │
│  │  Connection Pool Configuration:                               │  │
│  │  • Host, User, Password from .env.local                       │  │
│  │  • Connection pooling (max 10 connections)                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Users Table                                                  │  │
│  │                                                               │  │
│  │  Columns:                                                     │  │
│  │  • id (PRIMARY KEY)                                           │  │
│  │  • name, email, password, role                                │  │
│  │  • phone, address, firm, position                             │  │
│  │  • specialty, bar_number, years_experience                    │  │
│  │  • education, bio                                             │  │
│  │  • created_at, updated_at                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Projects Table                                               │  │
│  │                                                               │  │
│  │  Used for statistics:                                         │  │
│  │  • user_id (FOREIGN KEY)                                      │  │
│  │  • status (active, in_progress, completed)                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Tasks Table                                                  │  │
│  │                                                               │  │
│  │  Used for statistics:                                         │  │
│  │  • project_id (FOREIGN KEY)                                   │  │
│  │  • estimated_hours                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

### 1. Page Load (GET Profile)
```
User navigates to /profile
    ↓
Middleware checks JWT token
    ↓
Profile page component mounts
    ↓
useEffect triggers fetchProfile()
    ↓
GET /api/profile with credentials
    ↓
API verifies JWT token
    ↓
Extract userId from token
    ↓
SELECT * FROM users WHERE id = userId
    ↓
Return profile data as JSON
    ↓
Component updates state with profile data
    ↓
UI renders profile information
```

### 2. Load Statistics (GET Stats)
```
Profile page component mounts
    ↓
useEffect triggers fetchProfileStats()
    ↓
GET /api/profile/stats with credentials
    ↓
API verifies JWT token
    ↓
Extract userId from token
    ↓
Execute multiple queries:
  • COUNT active projects
  • COUNT completed projects
  • SUM task hours
    ↓
Calculate success rate
    ↓
Return statistics as JSON
    ↓
Component updates state with stats
    ↓
UI renders statistics cards
```

### 3. Update Profile (PUT Profile)
```
User clicks "Edit Profile"
    ↓
Component enters edit mode
    ↓
User modifies form fields
    ↓
User clicks "Save Profile"
    ↓
handleSave() function called
    ↓
PUT /api/profile with updated data
    ↓
API verifies JWT token
    ↓
Extract userId from token
    ↓
Validate request body (name, email required)
    ↓
UPDATE users SET ... WHERE id = userId
    ↓
SELECT updated profile data
    ↓
Return updated profile as JSON
    ↓
Component updates state with new data
    ↓
Exit edit mode
    ↓
UI shows updated profile
```

## Component Structure

```
ProfilePage
├── Loading State (conditional)
│   └── Spinner + "Loading profile..."
│
├── Error State (conditional)
│   └── Error message banner
│
└── Main Content
    ├── Header
    │   └── Edit/Save Button
    │
    ├── Left Column (Profile Card)
    │   ├── Profile Picture
    │   ├── Name (editable)
    │   ├── Position
    │   ├── Contact Info (editable)
    │   │   ├── Email
    │   │   ├── Phone
    │   │   ├── Address
    │   │   └── Firm
    │   └── Statistics Cards
    │       ├── Active Cases
    │       ├── Completed Cases
    │       ├── Success Rate
    │       └── Hours Billed
    │
    └── Right Column
        ├── Professional Information (editable)
        │   ├── Specialty
        │   ├── Bar Number
        │   ├── Years of Experience
        │   └── Education
        │
        ├── Biography (editable)
        │   └── Bio text area
        │
        └── Recent Activity
            └── Activity items (static for now)
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Middleware Authentication                          │
│  • Verify JWT token before page access                      │
│  • Redirect to login if unauthorized                         │
│                                                              │
│  Layer 2: API Route Authentication                           │
│  • Verify JWT token on every API call                       │
│  • Return 401 if token invalid/missing                      │
│                                                              │
│  Layer 3: User Authorization                                 │
│  • Extract userId from verified token                        │
│  • Only allow access to own profile                         │
│  • Cannot access other users' data                          │
│                                                              │
│  Layer 4: Input Validation                                   │
│  • Validate required fields (name, email)                    │
│  • Sanitize user input                                       │
│  • Return 400 for invalid data                              │
│                                                              │
│  Layer 5: Database Security                                  │
│  • Use parameterized queries                                 │
│  • Prevent SQL injection                                     │
│  • Connection pooling with limits                            │
│                                                              │
│  Layer 6: XSS Prevention                                     │
│  • React auto-escapes user input                            │
│  • No dangerouslySetInnerHTML used                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Type System

```
┌─────────────────────────────────────────────────────────────┐
│                    Type Definitions                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User (Database Model)                                       │
│  ├── id: number                                              │
│  ├── name: string                                            │
│  ├── email: string                                           │
│  ├── role: string                                            │
│  ├── phone?: string                                          │
│  ├── address?: string                                        │
│  ├── firm?: string                                           │
│  ├── position?: string                                       │
│  ├── specialty?: string                                      │
│  ├── bar_number?: string                                     │
│  ├── years_experience?: number                               │
│  ├── education?: string                                      │
│  ├── bio?: string                                            │
│  ├── created_at?: Date                                       │
│  └── updated_at?: Date                                       │
│                                                              │
│  UserProfile (Frontend Model)                                │
│  ├── id: number                                              │
│  ├── name: string                                            │
│  ├── email: string                                           │
│  ├── phone: string                                           │
│  ├── address: string                                         │
│  ├── firm: string                                            │
│  ├── position: string                                        │
│  ├── specialty: string                                       │
│  ├── barNumber: string (camelCase)                           │
│  ├── yearsExperience: number (camelCase)                     │
│  ├── education: string                                       │
│  └── bio: string                                             │
│                                                              │
│  ProfileStats                                                │
│  ├── activeCases: number                                     │
│  ├── completedCases: number                                  │
│  ├── successRate: string (e.g., "92%")                       │
│  └── hoursBilled: number                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
Frontend Error Handling
    ↓
Try-Catch Block
    ↓
API Call Fails
    ↓
Catch Error
    ↓
Set error state
    ↓
Display error message to user
    ↓
Log error to console
    ↓
Keep UI in stable state

Backend Error Handling
    ↓
Try-Catch Block
    ↓
Database Query Fails
    ↓
Catch Error
    ↓
Log error to console
    ↓
Return JSON error response
    ↓
Set appropriate HTTP status code
    ↓
Frontend receives error
```

## Performance Considerations

1. **Database Connection Pooling**
   - Max 10 concurrent connections
   - Reuse connections for efficiency
   - Automatic connection management

2. **API Response Optimization**
   - Only return necessary fields
   - Use SELECT with specific columns
   - Avoid N+1 queries

3. **Frontend State Management**
   - Single source of truth (useState)
   - Minimize re-renders
   - Efficient form handling

4. **Caching Strategy**
   - JWT token cached in cookies
   - Profile data fetched on mount
   - Stats fetched separately (can be cached)

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API routes
   - JWT tokens (no session storage)
   - Database connection pooling

2. **Vertical Scaling**
   - Optimized database queries
   - Indexed database columns
   - Efficient data structures

3. **Future Enhancements**
   - Redis caching for profile data
   - CDN for static assets
   - Database read replicas
   - API rate limiting
