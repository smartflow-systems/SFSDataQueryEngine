import express from "express";
import path from "path";
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const clientDir = path.join(process.cwd(),"dist","client");
app.use(express.static(clientDir));
app.get("/health",(_,res)=>res.json({ok:true}));
app.get("*",(req,res)=>res.sendFile(path.join(clientDir,"index.html")));
app.listen(PORT, ()=>console.log("listening on", PORT));
