# ZIJANI Test Accounts

All test accounts are pre-configured with the password: **TestPassword123!**

## Account Manager
- **Email:** test.manager@zijani.local
- **Password:** TestPassword123!
- **Role:** Account Manager
- **Permissions:** Log collections, manage clients, view dashboard metrics
- **City:** Nairobi

## Finance Team
- **Email:** test.finance@zijani.local
- **Password:** TestPassword123!
- **Role:** Finance
- **Permissions:** Review collections, assign pricing, process payments, view financial dashboard
- **City:** Nairobi

## Warehouse Manager
- **Email:** test.warehouse@zijani.local
- **Password:** TestPassword123!
- **Role:** Warehouse Manager
- **Permissions:** Verify deliveries, manage inventory, flag discrepancies, view warehouse dashboard
- **City:** Nairobi

## Sales Team
- **Email:** test.sales@zijani.local
- **Password:** TestPassword123!
- **Role:** Account Manager
- **Permissions:** Create sales orders, manage dispatch, check inventory, view sales dashboard
- **City:** Nairobi

## Admin
- **Email:** test.admin@zijani.local
- **Password:** TestPassword123!
- **Role:** Admin
- **Permissions:** Manage all users, deactivate accounts, access admin dashboard
- **City:** Nairobi

---

## How to Create Test Accounts

### Option 1: Using the Seed Script (Recommended)

1. Ensure you have Supabase environment variables set in your project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for seeding)

2. Run the seed script:
   ```bash
   npm run seed:test
   ```

### Option 2: Manual Signup
1. Navigate to the signup page
2. Create an account with any email/password
3. You can then manage roles through the Admin panel

### Testing Workflow

#### As Account Manager:
1. Login with `test.manager@zijani.local`
2. Navigate to Collections → Create new collection
3. Add client information and collection details
4. Submit for review

#### As Finance Team:
1. Login with `test.finance@zijani.local`
2. Go to Collections → Review
3. Approve/reject pending collections
4. View Payments dashboard

#### As Warehouse Manager:
1. Login with `test.warehouse@zijani.local`
2. Go to Warehouse
3. Receive approved collections
4. Verify quantities and flag discrepancies if needed

#### As Sales Team:
1. Login with `test.sales@zijani.local`
2. Go to Sales → Create order
3. Check current inventory
4. Create dispatch orders

#### As Admin:
1. Login with `test.admin@zijani.local`
2. Go to Admin → Users
3. Manage user roles and deactivation status

---

## Notes

- All test accounts are in the Nairobi city
- Test accounts are marked as active by default
- You can modify test account details anytime
- For development, you can manually create additional test accounts with different cities or roles
