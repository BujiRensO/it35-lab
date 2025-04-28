
---

### **PostgreSQL: Sample `users` Table**  

```sql
-- Enable pgcrypto extension for secure hashing (if needed)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    user_firstname text,
    user_lastname text,
    user_avatar_url TEXT,
    user_password TEXT NOT NULL,
    date_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Supabase Packages (NPM Install)**  

```sh
npm install bcryptjs          # For password hashing
npm install @supabase/supabase-js  # Supabase client SDK
```

**Note:**  
- `bcryptjs` is used for securely hashing passwords before storing them in the database.  
- `@supabase/supabase-js` is the official JavaScript client for interacting with Supabase.  

---

### **`.env` Format (Environment Variables)**  

```sh
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

**Reminder:**  
🔒 Never expose your Supabase service role key on the client side.  
💡 Use environment variables securely in `.env` files and avoid committing them to version control.  

---



### **Upload Photo in posts**  

### **Create a new bucket named "post-photos"** 
for posting with photo
```sql
CREATE TABLE posts (
  post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  post_content TEXT,
  photo_url TEXT,
  post_created_at TIMESTAMPTZ DEFAULT NOW(),
  post_updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ADD COLUMN avatar_url TEXT;
ALTER TABLE posts ADD COLUMN photo_url TEXT;
```


### **Row Level Security for Posts**  
```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create access policies
CREATE POLICY "Enable public read access" 
ON posts FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" 
ON posts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for post owners"
ON posts FOR UPDATE USING (user_id = (select auth.uid()::text)::integer);

CREATE POLICY "Enable delete for post owners" 
ON posts FOR DELETE USING (user_id = (select auth.uid()::text)::integer);
```

