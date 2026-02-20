import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    "http://localhost:5173",
    "https://video-upload-livid.vercel.app"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({
    extended: true, limit: "16kb"
}))
app.use(express.static("public"))

app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import socialRouter from './routes/social.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/social", socialRouter)


export { app }