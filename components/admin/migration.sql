-- Check if pdfs column exists in packages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'packages' 
    AND column_name = 'pdfs'
  ) THEN
    ALTER TABLE packages 
    ADD COLUMN pdfs TEXT[] DEFAULT '{}';
  END IF;
END
$$;

-- Check if payment_visibility column exists in packages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'packages' 
    AND column_name = 'payment_visibility'
  ) THEN
    ALTER TABLE packages 
    ADD COLUMN payment_visibility BOOLEAN DEFAULT TRUE;

    -- Update existing records to use payment_visibility from payment object
    UPDATE packages 
    SET payment_visibility = (payment->>'isVisible')::BOOLEAN
    WHERE payment ? 'isVisible';
  END IF;
END
$$; 