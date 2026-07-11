import pg from "pg"; import { pgConnectionString } from "./_secrets.mjs";
const c=new pg.Client({connectionString:pgConnectionString(),ssl:{rejectUnauthorized:false}});await c.connect();
const pol=(await c.query(`select policyname, tablename, roles::text, cmd from pg_policies where schemaname='storage'`)).rows;
console.log("STORAGE policies:", JSON.stringify(pol));
const rls=(await c.query(`select relname, relrowsecurity from pg_class where relname in ('requests','guest_profiles','availability','site_settings','rooms')`)).rows;
console.log("RLS:", JSON.stringify(rls));
const grants=(await c.query(`select routine_name, grantee, privilege_type from information_schema.role_routine_grants where routine_schema='public' and grantee in ('anon','authenticated') order by routine_name`)).rows;
console.log("FN grants:", JSON.stringify(grants));
await c.end();
