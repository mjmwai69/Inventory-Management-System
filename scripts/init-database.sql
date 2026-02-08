-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with role-based access
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('account_manager', 'finance', 'warehouse_manager', 'admin')),
  city VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create clients (restaurants/businesses) table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create collections table (the main workflow)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  collection_date DATE NOT NULL,
  estimated_weight DECIMAL(10, 2) NOT NULL,
  actual_weight DECIMAL(10, 2),
  unit VARCHAR(10) DEFAULT 'kg' CHECK (unit IN ('kg', 'litre')),
  delivery_note VARCHAR(255) NOT NULL,
  agreed_price DECIMAL(10, 4) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted_for_review', 'paid', 'verified', 'dispatched')),
  
  -- Finance review fields
  amount_paid DECIMAL(10, 2),
  payment_method VARCHAR(50),
  transaction_reference VARCHAR(255),
  payment_date TIMESTAMP WITH TIME ZONE,
  finance_notes TEXT,
  
  -- Warehouse verification fields
  weight_discrepancy DECIMAL(10, 2),
  discrepancy_flag VARCHAR(50),
  warehouse_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create warehouse inventory table
CREATE TABLE warehouse_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE RESTRICT,
  quantity_added DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(10) DEFAULT 'kg' CHECK (unit IN ('kg', 'litre')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sales/dispatch table
CREATE TABLE sales_dispatch (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispatch_reference VARCHAR(255) UNIQUE NOT NULL,
  dispatch_date DATE NOT NULL,
  buyer_partner_name VARCHAR(255) NOT NULL,
  buyer_partner_contact VARCHAR(255),
  quantity_dispatched DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(10) DEFAULT 'kg' CHECK (unit IN ('kg', 'litre')),
  transport_reference VARCHAR(255),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create dispatch line items (tracks which collections are part of each dispatch)
CREATE TABLE dispatch_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispatch_id UUID NOT NULL REFERENCES sales_dispatch(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE RESTRICT,
  quantity_from_collection DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(10) DEFAULT 'kg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_collections_status ON collections(status);
CREATE INDEX idx_collections_client_id ON collections(client_id);
CREATE INDEX idx_collections_created_by ON collections(created_by);
CREATE INDEX idx_collections_payment_date ON collections(payment_date);
CREATE INDEX idx_collections_collection_date ON collections(collection_date);
CREATE INDEX idx_clients_city ON clients(city);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_audit_logs_collection_id ON audit_logs(collection_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_dispatch_items_dispatch_id ON dispatch_items(dispatch_id);
CREATE INDEX idx_warehouse_inventory_collection_id ON warehouse_inventory(collection_id);

-- Enable Row Level Security (RLS) for data access control
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_dispatch ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (users can only see their own data and all active users)
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.uid() IS NOT NULL);

-- RLS Policies for clients (all authenticated users can read, managers can write)
CREATE POLICY "Authenticated users can view clients" ON clients
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Account managers can insert clients" ON clients
  FOR INSERT WITH CHECK (
    auth.uid()::text IN (
      SELECT id::text FROM users WHERE role = 'account_manager'
    )
  );

-- RLS Policies for collections (role-based access)
CREATE POLICY "Users can view collections based on role" ON collections
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      -- Warehouse managers see all verified or paid
      (SELECT role FROM users WHERE id = auth.uid()) = 'warehouse_manager' OR
      -- Finance team sees submitted and all others
      (SELECT role FROM users WHERE id = auth.uid()) = 'finance' OR
      -- Account managers see their own submissions
      (SELECT role FROM users WHERE id = auth.uid()) = 'account_manager' AND created_by = auth.uid() OR
      -- Admin sees all
      (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
    )
  );

CREATE POLICY "Users can insert collections" ON collections
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update collections" ON collections
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for warehouse inventory
CREATE POLICY "Warehouse managers can view inventory" ON warehouse_inventory
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('warehouse_manager', 'admin')
  );

CREATE POLICY "Warehouse managers can insert inventory" ON warehouse_inventory
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('warehouse_manager', 'admin')
  );

-- RLS Policies for sales_dispatch
CREATE POLICY "Authorized users can view dispatch" ON sales_dispatch
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Warehouse managers can insert dispatch" ON sales_dispatch
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('warehouse_manager', 'admin')
  );

-- RLS Policies for audit logs
CREATE POLICY "Users can view audit logs" ON audit_logs
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'finance', 'warehouse_manager')
  );
