-- Table for System Errors and Monitoring
CREATE TABLE IF NOT EXISTS system_errors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    error_name text NOT NULL,
    component text NOT NULL,
    message text NOT NULL,
    severity text NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    impact_description text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE system_errors;
