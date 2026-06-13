-- ============================================================================
--  20260611080000_enable_extensions.sql
--
--  Extensions the rest of the schema depends on. Loaded first by filename order.
--  - pgcrypto: gen_random_uuid() for default IDs (we could also use uuid-ossp,
--    but pgcrypto is bundled with Supabase and doesn't need separate install)
--  - citext: case-insensitive text, used for email so "Foo@bar.com" and
--    "foo@bar.com" collide (Postgres normalizes via lower() by default,
--    citext just makes the intent explicit)
-- ============================================================================

create extension if not exists "pgcrypto" with schema "extensions";
create extension if not exists "citext"   with schema "extensions";
