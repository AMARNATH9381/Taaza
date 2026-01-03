-- Add email column to notification_requests table
ALTER TABLE notification_requests ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL DEFAULT '';

-- Add index for email
CREATE INDEX IF NOT EXISTS idx_notification_email ON notification_requests(email);