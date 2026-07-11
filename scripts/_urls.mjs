import { createClient } from "@supabase/supabase-js";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
const s=fs.readFileSync(path.join(os.homedir(),".claude","secrets","supabase.txt"),"utf8");
const url=s.match(/SUPABASE_URL=(.*)/)[1].trim(), key=s.match(/SUPABASE_PUBLISHABLE_KEY=(.*)/)[1].trim();
const sb=createClient(url,key,{auth:{persistSession:false}});
const room=(await sb.from("rooms").select("id,slug").eq("slug","ms-61-room-1").single()).data;
const gallery=(await sb.from("photos").select("url").eq("room_id",room.id).order("sort_index").limit(4)).data.map(p=>p.url);
const commons=(await sb.from("photos").select("url").is("room_id",null).order("sort_index").limit(3)).data.map(p=>p.url);
const covers=(await sb.from("photos").select("url,room_id").not("room_id","is",null).order("sort_index").limit(60)).data;
const seen=new Set(); const similar=[];
for(const c of covers){ if(!seen.has(c.room_id)){seen.add(c.room_id); similar.push(c.url);} if(similar.length>=4)break; }
console.log(JSON.stringify({gallery,commons,similar},null,0));
