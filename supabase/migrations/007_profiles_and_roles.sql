-- Profiles table for role-based access
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text,
  role text NOT NULL DEFAULT 'editor',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    CASE
      WHEN NEW.email = 'admin@verticurl.com' THEN 'admin'
      ELSE 'editor'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add author_id to articles
ALTER TABLE articles ADD COLUMN author_id uuid REFERENCES profiles(id);

-- Seed: create admin profile if auth.users already has admin@verticurl.com
INSERT INTO profiles (id, email, display_name, role)
SELECT id, email, 'Admin', 'admin'
FROM auth.users
WHERE email = 'admin@verticurl.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Assign all existing articles to admin
UPDATE articles SET author_id = (
  SELECT id FROM profiles WHERE email = 'admin@verticurl.com' LIMIT 1
) WHERE author_id IS NULL;
