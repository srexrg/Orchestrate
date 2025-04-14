import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";


const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes)


app.get("/", (req, res) => {
    res.send("Hello World")
})



app.listen(3000, () => {
    console.log("Server is running on port 3000")
})