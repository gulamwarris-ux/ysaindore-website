# Auth-Gated App Testing Playbook (Emergent Google Auth)

DB: test_database. Session cookie name: `session_token`. Backend `/api` prefix.
Admin access is gated by ADMIN_EMAILS allowlist in backend/.env (currently drarifa@ysaindore.com).

## Step 1: Create Test Admin User & Session (mongosh)
Create the user with an email that IS in ADMIN_EMAILS so admin endpoints authorise.

```
mongosh --eval "
use('test_database');
var userId = 'user_testadmin';
var sessionToken = 'test_session_admin_' + Date.now();
db.users.updateOne(
  {email:'drarifa@ysaindore.com'},
  {\$set:{user_id:userId, email:'drarifa@ysaindore.com', name:'Dr Arifa Sheikh', picture:'', created_at:new Date().toISOString()}},
  {upsert:true}
);
db.user_sessions.insertOne({
  user_id:userId,
  session_token:sessionToken,
  expires_at:new Date(Date.now()+7*24*60*60*1000).toISOString(),
  created_at:new Date().toISOString()
});
print('Session token: ' + sessionToken);
"
```

## Step 2: Backend API tests (Authorization header fallback works)
```
curl -s $API/api/auth/me -H "Authorization: Bearer <TOKEN>"          # returns user, is_admin true
curl -s $API/api/admin/enquiries -H "Authorization: Bearer <TOKEN>"   # returns list
curl -s $API/api/admin/enquiries/export -H "Authorization: Bearer <TOKEN>"  # CSV
```
A non-admin token (email not in allowlist) must get 403 on /admin/*.
No token must get 401.

## Step 3: Browser testing (cookie)
```
await page.context.add_cookies([{ "name":"session_token", "value":"<TOKEN>",
  "domain":"<host>", "path":"/", "httpOnly":true, "secure":true, "sameSite":"None" }])
await page.goto("<url>/admin")
```

## Cleanup
```
mongosh --eval "use('test_database'); db.user_sessions.deleteMany({session_token:/test_session/});"
```

## Checklist
- /api/auth/me returns user with is_admin
- /admin/* returns 401 without token, 403 for non-allowlisted email, 200 for allowlisted
- Public POST /api/enquiries: honeypot `company` filled -> 200 but NOT stored; rate limit 8/10min -> 429
