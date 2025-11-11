# Database Setup for Profile Feature

## Prerequisites
- MySQL 5.7+ or MariaDB 10.2+
- Database connection configured in `.env.local`

## Environment Variables
Make sure your `.env.local` file contains:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=feature_flow
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
```

## Running Migrations

### 1. Add Profile Fields to Users Table
Run the following SQL migration to add profile fields to the users table:

```bash
mysql -u your_username -p feature_flow < database/migrations/add_profile_fields_to_users.sql
```

Or connect to your MySQL database and run:
```sql
SOURCE database/migrations/add_profile_fields_to_users.sql;
```

### 2. Verify the Migration
Check that the new columns were added:
```sql
DESCRIBE users;
```

You should see the following new columns:
- phone
- address
- firm
- position
- specialty
- bar_number
- years_experience
- education
- bio
- updated_at

## Testing the Profile Feature

### 1. Login to the Application
Navigate to `/login` and login with your credentials.

### 2. Access Your Profile
Navigate to `/profile` to view your profile page.

### 3. Edit Your Profile
Click the "Edit Profile" button, update your information, and click "Save Profile".

### 4. Verify the Changes
The profile should update in real-time and persist in the database.

## API Endpoints

### GET /api/profile
Fetches the current user's profile data.
- **Authentication**: Required (JWT token in cookie)
- **Response**: User profile object

### PUT /api/profile
Updates the current user's profile data.
- **Authentication**: Required (JWT token in cookie)
- **Body**: Profile data object
- **Response**: Updated user profile object

### GET /api/profile/stats
Fetches the current user's profile statistics.
- **Authentication**: Required (JWT token in cookie)
- **Response**: Statistics object with activeCases, completedCases, successRate, hoursBilled

## Troubleshooting

### Database Connection Issues
1. Verify your `.env.local` file has correct database credentials
2. Ensure MySQL server is running
3. Check that the database `feature_flow` exists

### Migration Errors
If you get "column already exists" errors, the migration has already been run. You can skip it or modify the SQL to use `ADD COLUMN IF NOT EXISTS`.

### Profile Not Loading
1. Check browser console for errors
2. Verify JWT token is present in cookies
3. Check that the user exists in the database
4. Verify API endpoints are accessible

## Database Schema

### Users Table (Updated)
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  phone VARCHAR(20),
  address VARCHAR(255),
  firm VARCHAR(100),
  position VARCHAR(100),
  specialty VARCHAR(100),
  bar_number VARCHAR(50),
  years_experience INT,
  education VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
