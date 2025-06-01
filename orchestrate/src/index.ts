import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import venueRoutes from "./routes/venue.routes";
import attendeeRoutes from "./routes/attendee.routes";
import dotenv from "dotenv";

dotenv.config({ path: ".env" })

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/events", eventRoutes)
app.use("/api/v1/venues", venueRoutes)
app.use("/api/v1/attendees", attendeeRoutes)

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})