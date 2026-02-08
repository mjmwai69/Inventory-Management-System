#!/usr/bin/env node

/**
 * Seed script to create test accounts in Supabase
 * Run with: node scripts/seed-test-accounts.js
 * 
 * Test Account Credentials:
 * All accounts use password: TestPassword123!
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testAccounts = [
  {
    email: 'test.manager@zijani.local',
    password: 'TestPassword123!',
    full_name: 'John Manager',
    role: 'account_manager',
    city: 'Nairobi',
    description: 'Account Manager - Can log collections and manage clients'
  },
  {
    email: 'test.finance@zijani.local',
    password: 'TestPassword123!',
    full_name: 'Jane Finance',
    role: 'finance',
    city: 'Nairobi',
    description: 'Finance Team - Can review collections and process payments'
  },
  {
    email: 'test.warehouse@zijani.local',
    password: 'TestPassword123!',
    full_name: 'David Warehouse',
    role: 'warehouse_manager',
    city: 'Nairobi',
    description: 'Warehouse Manager - Can verify deliveries and manage inventory'
  },
  {
    email: 'test.sales@zijani.local',
    password: 'TestPassword123!',
    full_name: 'Sarah Sales',
    role: 'account_manager',
    city: 'Nairobi',
    description: 'Sales Team - Can create sales orders and manage dispatch'
  },
  {
    email: 'test.admin@zijani.local',
    password: 'TestPassword123!',
    full_name: 'Admin User',
    role: 'admin',
    city: 'Nairobi',
    description: 'Admin - Can manage users and system settings'
  }
];

async function seedTestAccounts() {
  console.log('🌱 Starting to seed test accounts...\n');

  for (const account of testAccounts) {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.full_name,
          role: account.role,
        }
      });

      if (authError) {
        console.log(`⚠️  ${account.email}: ${authError.message}`);
        continue;
      }

      // Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: account.email,
            password_hash: authData.user.id, // Placeholder - Supabase handles actual hashing
            full_name: account.full_name,
            role: account.role,
            city: account.city,
            is_active: true,
          }
        ]);

      if (profileError) {
        console.log(`❌ ${account.email}: ${profileError.message}`);
      } else {
        console.log(`✅ ${account.email}`);
        console.log(`   Role: ${account.role}`);
        console.log(`   ${account.description}\n`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${account.email}:`, error.message);
    }
  }

  console.log('✨ Seed complete!\n');
  console.log('📝 Test Account Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  testAccounts.forEach(acc => {
    console.log(`Email: ${acc.email}`);
    console.log(`Password: ${acc.password}`);
    console.log(`Role: ${acc.role}\n`);
  });
}

seedTestAccounts().catch(console.error);
