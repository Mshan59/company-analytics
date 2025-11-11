# Fix for 500 Internal Server Error

## ✅ Issues Fixed

### 1. Removed `role` column from queries
The profile API was trying to SELECT the `role` column which doesn't exist in your users table.

### 2. Made stats queries more resilient
The stats endpoint now handles missing `projects` and `tasks` tables gracefully by returning zeros instead of crashing.

## 🔄 What to Do Now

### Step 1: Restart Dev Server
```bash
# Press Ctrl+C in your terminal to stop the server
# Then restart:
npm run dev
```

### Step 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Step 3: Login Again
1. Navigate to `http://localhost:3000/login`
2. Enter your credentials
3. Click Login

### Step 4: Test Profile Page
1. Navigate to `http://localhost:3000/profile`
2. You should now see:
   - ✅ Profile data loading (200 OK)
   - ✅ Stats showing (even if all zeros)
   - ✅ No 500 errors

## 📊 Expected Behavior

### Profile Data
- Should load successfully with your user information
- Empty fields will show as blank (that's normal)
- You can click "Edit Profile" to fill them in

### Statistics
- Will show **0** for everything if you have no projects/tasks
- This is **normal** and **not an error**
- To see real stats, you need to create projects and tasks

## 🔍 Check Server Logs

Look at your terminal where `npm run dev` is running. You should see:
- ✅ No error messages
- ✅ Successful API calls
- ⚠️ Possible warning: "Could not fetch project stats" (this is OK if you don't have projects table set up yet)

## 🎯 Verify It's Working

### Test 1: GET Profile
Open browser DevTools → Network tab:
```
GET /api/profile → 200 OK
Response: { id: 1, name: "...", email: "...", ... }
```

### Test 2: GET Stats
```
GET /api/profile/stats → 200 OK
Response: { activeCases: 0, completedCases: 0, successRate: "0%", hoursBilled: 0 }
```

### Test 3: Edit and Save
1. Click "Edit Profile"
2. Change your name or phone
3. Click "Save Profile"
```
PUT /api/profile → 200 OK
Response: { id: 1, name: "Updated Name", ... }
```

## 🐛 If Still Getting 500 Error

### Check Database Connection
```sql
-- In MySQL/phpMyAdmin, run:
SELECT * FROM users WHERE id = YOUR_USER_ID;
```

### Check Column Names
```sql
-- Verify these columns exist:
DESCRIBE users;
```

You should see:
- ✅ id
- ✅ name
- ✅ email
- ✅ password
- ✅ created_at
- ✅ phone
- ✅ address
- ✅ firm
- ✅ position
- ✅ specialty
- ✅ bar_number
- ✅ years_experience
- ✅ education
- ✅ bio
- ✅ updated_at

### Check Server Error Logs
In your terminal, look for detailed error messages like:
```
Error fetching profile: [detailed error message]
```

### Common Issues

**Issue: "Unknown column 'role'"**
✅ **Fixed!** We removed `role` from the queries.

**Issue: "Table 'projects' doesn't exist"**
✅ **Fixed!** Stats endpoint now handles this gracefully.

**Issue: "Unknown column 'user_id' in projects"**
This means your projects table has a different structure. The stats will return zeros (which is fine).

## 📝 Database Schema Requirements

### Minimum Required (for profile to work)
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  phone VARCHAR(20),
  address VARCHAR(255),
  firm VARCHAR(100),
  position VARCHAR(100),
  specialty VARCHAR(100),
  bar_number VARCHAR(50),
  years_experience INT,
  education VARCHAR(255),
  bio TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Optional (for statistics to work)
```sql
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  user_id INT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  project_id INT,
  estimated_hours DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ✨ Success Indicators

You'll know it's working when:
- ✅ No 500 errors in Network tab
- ✅ Profile page loads without errors
- ✅ Your name and email display
- ✅ Statistics show (even if 0)
- ✅ Can edit and save profile
- ✅ No errors in browser console
- ✅ No errors in server logs

## 🎉 Next Steps

Once the 500 error is resolved:

1. **Fill out your profile**
   - Click "Edit Profile"
   - Add your information
   - Click "Save Profile"

2. **Verify changes persist**
   - Refresh the page
   - Your changes should still be there

3. **Test on different browsers**
   - Chrome
   - Firefox
   - Edge

4. **Optional: Add test projects for statistics**
   ```sql
   INSERT INTO projects (name, user_id, status) 
   VALUES ('Test Project', YOUR_USER_ID, 'active');
   ```

## 📞 Still Having Issues?

If you're still getting 500 errors after these fixes:

1. **Check the exact error message** in your terminal
2. **Take a screenshot** of the error
3. **Check browser console** for any JavaScript errors
4. **Verify database connection** is working:
   ```bash
   mysql -u root -p feature_flow -e "SELECT 1"
   ```

The most common cause of 500 errors is:
- ❌ Database column mismatch
- ❌ Missing database connection
- ❌ Incorrect JWT_SECRET
- ❌ Database query syntax error

All of these should now be fixed! 🎉
