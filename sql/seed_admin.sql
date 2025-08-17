-- Idempotent admin seeding
INSERT INTO users (username, password_hash, role)
VALUES (
  'admin',
  crypt('admin123', gen_salt('bf')),
  'admin'
)
ON CONFLICT (username) DO NOTHING;
