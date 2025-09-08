import express from "express"; import { exec } from "child_process"; import path from "path"; import fs from "fs";
const app = express(); app.use(express.json()); app.use(express.urlencoded({ extended: false }));
const log = (m:string)=>console.log(new Date().toISOString(), m);
// API logger
app.use((req:any,res:any,next:any)=>{const t=Date.now(),o=res.json.bind(res);res.json=(b:any)=>{const r=o(b);
  if(req.path.startsWith("/api")){let s=;
  if(s.length>120)s=s.slice(0,119)+"…";log(s)} return r}; next()});
// Health
app.get("/api/health",(_q,res)=>res.json({ok:true,app:"SFSDataQueryEngine"}));
// Force sync
app.post("/gh-sync",(req,res)=>{const ok=req.get("authorization")==="Bearer "+process.env.SYNC_TOKEN;
  if(!ok) return res.status(401).json({ok:false});
  const ref=(req.body?.ref as string)||"main";
  exec(,(e,out,er)=> e?res.status(500).json({ok:false,err:String(er||e)}):res.json({ok:true,ref,out}))});
// Static (prod)
const dist=path.resolve("dist"); if(fs.existsSync(dist)){app.use(express.static(dist)); app.get("*",(_q,r)=>r.sendFile(path.join(dist,"index.html")))}
const port=parseInt(process.env.PORT||"5000",10); app.listen(port,"0.0.0.0",()=>log("serving on "+port));
