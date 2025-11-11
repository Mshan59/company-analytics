# Profile Feature - Testing Guide

## ✅ Issue Fixed

The authentication issue has been resolved. The login endpoint now:
1. Includes `userId` in the JWT payload (required by profile API)
2. Sets the token as an HTTP-only cookie automatically
3. Includes `role` field in the token

## 🧪 Testing Steps

### Step 1: Logout (Clear Old Token)
1. Open browser DevTools (F12)
2. Go to **Application** tab → **Cookies** → `localhost`
3. Delete the `token` cookie if it exists
4. Or navigate to `/logout`

### Step 2: Login Again
1. Navigate to `http://localhost:3000/login`
2. Enter your credentials
3. Click Login
4. You should be redirected to the home page

### Step 3: Check Token
1. Open DevTools → **Application** → **Cookies**
2. Verify `token` cookie exists
3. It should have these properties:
   - HttpOnly: ✓
   - Secure: ✓ (in production)
   - SameSite: Strict
   - Max-Age: 3600 (1 hour)

### Step 4: Test Profile Page
1. Navigate to `http://localhost:3000/profile`
2. You should see:
   - ✅ Your profile data loading
   - ✅ Statistics displaying
   - ✅ No 401 errors in Network tab

### Step 5: Test Profile Edit
1. Click "Edit Profile" button
2. Modify some fields (name, phone, etc.)
3. Click "Save Profile"
4. Verify:
   - ✅ Loading spinner appears
   - ✅ Success (no errors)
   - ✅ Changes persist after page refresh

## 🔍 Debugging

### Check Network Tab
Open DevTools → Network tab and look for:

**Expected Responses:**
```
GET /api/profile        → 200 OK
GET /api/profile/stats  → 200 OK
PUT /api/profile        → 200 OK
```

**If you still see 401:**
1. Check if token cookie exists
2. Verify JWT_SECRET in `.env.local` matches
3. Check token hasn't expired (1 hour validity)
4. Try logging out and logging in again

### Check Console
Look for any JavaScript errors in the browser console.

### Check Server Logs
In your terminal where `npm run dev` is running, look for:
- Login success messages
- Profile API calls
- Any error messages

## 🎯 What Changed

### Before (Broken)
```typescript
// Login was creating token with just 'id'
{ id: user.id, email: user.email, name: user.name }

// Profile API was looking for 'userId'
const userId = payload.userId; // undefined!
```

### After (Fixed)
```typescript
// Login now creates token with both 'id' and 'userId'
{ userId: user.id, id: user.id, email: user.email, name: user.name, role: 'user' }

// Profile API can find 'userId'
const userId = payload.userId; // Works! ✓

// Also sets cookie automatically
response.cookies.set('token', token, { ... });
```

## 📊 Expected Profile Data

After successful login, your profile should show:

**Personal Info:**
- Name: (from database)
- Email: (from database)
- Phone: (from database or empty)
- Address: (from database or empty)
- Firm: (from database or empty)
- Position: (from database or empty)

**Professional Info:**
- Specialty: (from database or empty)
- Bar Number: (from database or empty)
- Years of Experience: (from database or 0)
- Education: (from database or empty)

**Statistics:**
- Active Cases: (count from projects table)
- Completed Cases: (count from projects table)
- Success Rate: (calculated percentage)
- Hours Billed: (sum from tasks table)

## 🚨 Common Issues

### Issue: Still getting 401 after fix
**Solution:** 
1. Stop the dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Clear browser cache and cookies
4. Login again

### Issue: Token cookie not being set
**Solution:**
1. Check browser console for errors
2. Verify login API returns 200 status
3. Check Network tab → Response Headers for `Set-Cookie`

### Issue: Profile shows empty data
**Solution:**
1. This is normal if you haven't filled your profile yet
2. Click "Edit Profile" and add your information
3. Click "Save Profile"

### Issue: Statistics show 0
**Solution:**
This is normal if you have no projects/tasks. To add test data:
```sql
-- Add a test project
INSERT INTO projects (name, user_id, status) 
VALUES ('Test Project', YOUR_USER_ID, 'active');

-- Add a test task
INSERT INTO tasks (name, project_id, estimated_hours) 
VALUES ('Test Task', LAST_INSERT_ID(), 10);
```

## ✨ Success Checklist

- [ ] Can login successfully
- [ ] Token cookie is set after login
- [ ] Can access /profile without 401 error
- [ ] Profile data loads correctly
- [ ] Can edit profile fields
- [ ] Changes save successfully
- [ ] Changes persist after refresh
- [ ] Statistics display (even if 0)
- [ ] No errors in console
- [ ] No errors in Network tab

## 🎉 Next Steps

Once everything is working:

1. **Fill out your profile** with real information
2. **Create some projects** to see statistics update
3. **Test on different browsers** (Chrome, Firefox, Safari)
4. **Test on mobile** devices
5. **Consider adding profile picture** upload feature

## 📞 Still Having Issues?

If you're still experiencing problems:

1. **Check the server logs** for detailed error messages
2. **Verify database connection** is working
3. **Ensure all migrations** have been run
4. **Check JWT_SECRET** is set in `.env.local`
5. **Try with a fresh database** user account

### Quick Database Check
```sql
-- Verify user exists
SELECT id, name, email FROM users WHERE email = 'your@email.com';

-- Check if profile fields exist
DESCRIBE users;

-- Verify projects table exists
SHOW TABLES LIKE 'projects';
```

### Quick API Test (using curl)
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  -c cookies.txt \
  -v

# Test profile (should work now)
curl http://localhost:3000/api/profile \
  -b cookies.txt \
  -v
```

Happy testing! 🚀
