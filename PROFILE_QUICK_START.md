# Profile Feature - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Run Database Migration (1 minute)
```bash
# Connect to your MySQL database
mysql -u root -p feature_flow

# Run the migration
SOURCE database/migrations/add_profile_fields_to_users.sql;

# Verify the migration
DESCRIBE users;

# Exit MySQL
exit;
```

### Step 2: Verify Environment Variables (30 seconds)
Check that your `.env.local` file contains:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=feature_flow
DB_PORT=3306
JWT_SECRET=your_secret_key
```

### Step 3: Start the Application (30 seconds)
```bash
npm run dev
```

### Step 4: Test the Feature (3 minutes)
1. Open browser: `http://localhost:3000`
2. Login with your credentials
3. Navigate to `/profile`
4. Click "Edit Profile"
5. Update your information
6. Click "Save Profile"
7. Verify changes persist after page refresh

## ✅ Quick Verification Checklist

- [ ] Database migration completed successfully
- [ ] Environment variables configured
- [ ] Application running on localhost:3000
- [ ] Can login successfully
- [ ] Profile page loads without errors
- [ ] Can edit profile fields
- [ ] Changes save successfully
- [ ] Statistics display correctly

## 📁 Key Files to Know

### Backend
- `app/api/profile/route.ts` - Main profile API (GET/PUT)
- `app/api/profile/stats/route.ts` - Statistics API
- `models/user.ts` - Type definitions
- `lib/auth.ts` - Authentication utilities

### Frontend
- `app/profile/page.tsx` - Profile page component
- `lib/api/profile.ts` - API utility functions

### Database
- `database/migrations/add_profile_fields_to_users.sql` - Migration script
- `lib/db.ts` - Database connection

### Documentation
- `PROFILE_FEATURE_SUMMARY.md` - Complete feature overview
- `PROFILE_ARCHITECTURE.md` - Architecture diagrams
- `API_ENDPOINTS.md` - API reference
- `database/README.md` - Database setup guide

## 🔧 Common Issues & Quick Fixes

### Issue: Profile page shows "Loading..." forever
**Fix**: Check browser console for errors. Likely causes:
- Database not connected (check `.env.local`)
- User not logged in (check JWT token in cookies)
- Migration not run (check database schema)

### Issue: "Failed to fetch profile" error
**Fix**: 
```bash
# Check if database is running
mysql -u root -p -e "SELECT 1"

# Verify user exists
mysql -u root -p feature_flow -e "SELECT * FROM users LIMIT 1"
```

### Issue: Save button doesn't work
**Fix**: Check that required fields (name, email) are filled

### Issue: Statistics show 0 for everything
**Fix**: This is normal if you have no projects/tasks. Create some test data:
```sql
-- Create a test project
INSERT INTO projects (name, user_id, status) 
VALUES ('Test Project', YOUR_USER_ID, 'active');

-- Create a test task
INSERT INTO tasks (name, project_id, estimated_hours) 
VALUES ('Test Task', LAST_INSERT_ID(), 10);
```

## 🎯 Quick Testing Script

Run this to test all endpoints:

```bash
# Save as test_profile.sh

# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  -c cookies.txt \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Get profile
echo "\n--- GET Profile ---"
curl -s http://localhost:3000/api/profile \
  -b cookies.txt | jq

# 3. Get stats
echo "\n--- GET Stats ---"
curl -s http://localhost:3000/api/profile/stats \
  -b cookies.txt | jq

# 4. Update profile
echo "\n--- PUT Profile ---"
curl -s -X PUT http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1 234-567-8900",
    "firm": "Test Firm"
  }' | jq

# Cleanup
rm cookies.txt
```

## 📊 Sample Test Data

Use this SQL to populate test data:

```sql
-- Update your profile with sample data
UPDATE users 
SET 
  phone = '+1 (555) 123-4567',
  address = '123 Legal Avenue, New York, NY 10001',
  firm = 'Johnson & Associates',
  position = 'Corporate Attorney',
  specialty = 'Mergers & Acquisitions',
  bar_number = 'NY123456',
  years_experience = 8,
  education = 'J.D., Harvard Law School',
  bio = 'Experienced corporate attorney specializing in M&A transactions.'
WHERE id = YOUR_USER_ID;

-- Create sample projects
INSERT INTO projects (name, user_id, status, created_at) VALUES
('Johnson v. Smith Corp', YOUR_USER_ID, 'active', NOW()),
('ABC Corp Acquisition', YOUR_USER_ID, 'completed', NOW()),
('Davis Merger Agreement', YOUR_USER_ID, 'completed', NOW());

-- Create sample tasks
INSERT INTO tasks (name, project_id, estimated_hours, created_at) 
SELECT 
  'Research and Analysis',
  id,
  40,
  NOW()
FROM projects WHERE user_id = YOUR_USER_ID;
```

## 🎨 Customization Tips

### Change Profile Fields
1. Add column to database:
   ```sql
   ALTER TABLE users ADD COLUMN new_field VARCHAR(100);
   ```

2. Update type in `models/user.ts`:
   ```typescript
   export type User = {
     // ... existing fields
     new_field?: string;
   };
   ```

3. Update API in `app/api/profile/route.ts`:
   ```typescript
   // Add to SELECT query
   new_field
   
   // Add to UPDATE query
   new_field = ?
   ```

4. Update UI in `app/profile/page.tsx`:
   ```tsx
   <input
     name="newField"
     value={userData.newField}
     onChange={handleInputChange}
   />
   ```

### Add New Statistics
1. Update `app/api/profile/stats/route.ts`:
   ```typescript
   const [newStatResult] = await pool.query(
     `SELECT COUNT(*) as count FROM table WHERE condition`,
     [userId]
   );
   ```

2. Add to response:
   ```typescript
   return NextResponse.json({
     // ... existing stats
     newStat: newStatResult[0].count
   });
   ```

3. Update UI to display new stat

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials not committed to git
- [ ] HTTPS enabled in production
- [ ] Input validation on all fields
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React auto-escaping)
- [ ] Authentication required on all endpoints
- [ ] Users can only access own profile

## 📱 Mobile Responsiveness

The profile page is fully responsive:
- **Desktop**: 3-column layout
- **Tablet**: 2-column layout
- **Mobile**: Single column, stacked layout

Test on different screen sizes:
```bash
# Open in browser and use DevTools
# Cmd/Ctrl + Shift + M (Toggle device toolbar)
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Run database migration on production database
- [ ] Update environment variables on hosting platform
- [ ] Test all API endpoints in production
- [ ] Verify authentication works
- [ ] Test profile editing and saving
- [ ] Check statistics display correctly
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Set up database backups

## 📞 Need Help?

1. Check the documentation:
   - `PROFILE_FEATURE_SUMMARY.md` - Overview
   - `PROFILE_ARCHITECTURE.md` - Architecture
   - `API_ENDPOINTS.md` - API reference

2. Check browser console for errors

3. Check server logs:
   ```bash
   # In your terminal where npm run dev is running
   # Look for error messages
   ```

4. Verify database connection:
   ```bash
   mysql -u root -p feature_flow -e "SELECT 1"
   ```

5. Test API endpoints directly:
   ```bash
   # Use curl or Postman to test endpoints
   curl http://localhost:3000/api/profile
   ```

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Profile page loads without errors
- ✅ Your name and email display correctly
- ✅ Statistics show real numbers (or 0 if no data)
- ✅ Edit mode allows you to change fields
- ✅ Save button updates the database
- ✅ Changes persist after page refresh
- ✅ No errors in browser console
- ✅ No errors in server logs

## 🔄 Next Steps

After the profile feature is working:

1. **Add Profile Picture Upload**
   - Use file upload API
   - Store images in cloud storage
   - Display user avatar

2. **Add More Statistics**
   - Win/loss ratio
   - Average case duration
   - Client satisfaction score

3. **Add Activity Feed**
   - Real project updates
   - Recent document uploads
   - Team mentions

4. **Add Profile Sharing**
   - Public profile URL
   - Share on social media
   - Export as PDF

5. **Add Notifications**
   - Profile update confirmations
   - Email notifications
   - In-app notifications

Happy coding! 🎉
