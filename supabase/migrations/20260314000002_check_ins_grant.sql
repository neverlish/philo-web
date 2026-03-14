-- Grant access to authenticated users for check_ins table
-- Previously only service_role had access, causing upsert to fail for logged-in users

GRANT ALL ON public.check_ins TO authenticated;
