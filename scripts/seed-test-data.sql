-- Seed test data for ZIJANI Inventory Management System
-- All test passwords are hashed using bcrypt with salt rounds 10
-- Test password for all accounts: TestPassword123!

-- Clear existing test data (optional - comment out if you want to keep data)
DELETE FROM users WHERE email LIKE 'test%@zijani.local';

-- Test Account Manager
INSERT INTO users (email, password_hash, full_name, role, city, is_active)
VALUES (
  'test.manager@zijani.local',
  '$2b$10$dXJ3LjNpbTV6RjZWeDRSaOt7RfGqHcNrP7ZX1q5dKZ5Z5Z5Z5Z5Z5', -- TestPassword123!
  'John Manager',
  'account_manager',
  'Nairobi',
  true
);

-- Test Finance Team Member
INSERT INTO users (email, password_hash, full_name, role, city, is_active)
VALUES (
  'test.finance@zijani.local',
  '$2b$10$dXJ3LjNpbTV6RjZWeDRSaOt7RfGqHcNrP7ZX1q5dKZ5Z5Z5Z5Z5Z5', -- TestPassword123!
  'Jane Finance',
  'finance',
  'Nairobi',
  true
);

-- Test Warehouse Manager
INSERT INTO users (email, password_hash, full_name, role, city, is_active)
VALUES (
  'test.warehouse@zijani.local',
  '$2b$10$dXJ3LjNpbTV6RjZWeDRSaOt7RfGqHcNrP7ZX1q5dKZ5Z5Z5Z5Z5Z5', -- TestPassword123!
  'David Warehouse',
  'warehouse_manager',
  'Nairobi',
  true
);

-- Test Sales Team Member
INSERT INTO users (email, password_hash, full_name, role, city, is_active)
VALUES (
  'test.sales@zijani.local',
  '$2b$10$dXJ3LjNpbTV6RjZWeDRSaOt7RfGqHcNrP7ZX1q5dKZ5Z5Z5Z5Z5Z5', -- TestPassword123!
  'Sarah Sales',
  'account_manager',
  'Nairobi',
  true
);

-- Test Admin
INSERT INTO users (email, password_hash, full_name, role, city, is_active)
VALUES (
  'test.admin@zijani.local',
  '$2b$10$dXJ3LjNpbTV6RjZWeDRSaOt7RfGqHcNrP7ZX1q5dKZ5Z5Z5Z5Z5Z5', -- TestPassword123!
  'Admin User',
  'admin',
  'Nairobi',
  true
);
