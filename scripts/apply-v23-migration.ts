/**
 * v2.3 DDL cannot be executed via the Supabase JS client (no arbitrary SQL).
 * Run `scripts/migrations/v2.3-lessons-schema.sql` in the Supabase SQL Editor.
 *
 * Usage: npx tsx scripts/apply-v23-migration.ts
 */
import path from "node:path";

const sqlPath = path.join(
  process.cwd(),
  "scripts/migrations/v2.3-lessons-schema.sql",
);

console.log(
  "\nFluentUp v2.3 — apply database migration manually:\n\n" +
    "  1. Open Supabase Dashboard → SQL Editor\n" +
    "  2. Paste the contents of:\n\n" +
    `     ${sqlPath}\n\n` +
    "  3. Run the script.\n",
);
