import express from "express";
import dotenv from "dotenv";
dotenv.config()
import cors from "cors";

// import database
import "./utils/dbConnect.js";

// import public routers;
import publicRouter from "./controllers/public/public.js"

// import middleware
import middleware from "./auth/auth.js";

// import private routers
import privateRouter from "./controllers/private/private.js"

const app = express()
app.use(express.json());
let corsObject = {
    origin : ["http://localhost:5173"],
    methods : ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders : ["authorization"]
}
app.use(cors(corsObject))
const port = process.env.PORT;
app.get("/",(req,res)=>{
    try {
        res.status(200).json({msg : "server is running"})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})
app.use("/public",publicRouter);
app.use(middleware);
app.use("/private",privateRouter);

app.listen(port,()=>{
    console.log(`sever is running atr http://localhost:${port}`)
})