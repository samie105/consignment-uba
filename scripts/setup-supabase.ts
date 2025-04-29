/*
This is a script to set up the Supabase database tables.
You can run this script manually in the Supabase SQL editor.
*/
\
-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  weight NUMERIC,
  dimensions JSONB,
  sender JSONB,
  recipient JSONB,
  payment JSONB,
  current_location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

--Create
checkpoints
table
CREATE
TABLE
IF
NOT
EXISTS
checkpoints (
  id UUID PRIMARY KEY,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT,
  coordinates JSONB
)

--Create
package_images
table
CREATE
TABLE
IF
NOT
EXISTS
package_images (
  id UUID PRIMARY KEY,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--Create
indexes
CREATE
INDEX
IF
NOT
EXISTS
idx_packages_tracking_number
ON
packages(tracking_number)
CREATE
INDEX
IF
NOT
EXISTS
idx_checkpoints_package_id
ON
checkpoints(package_id)
CREATE
INDEX
IF
NOT
EXISTS
idx_package_images_package_id
ON
package_images(package_id)
