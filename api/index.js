import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"

// Import Routes
import usersRouter from "./routers/users.js"
import Loanrouter from "./routers/loan.js"
import Authrouter from "./routers/auth.js"
import Appointmentrouter from "./routers/appointment.js"
import Adminrouter from "./routers/admin.js"

// Load environment variables
dotenv.config()

// Database Configuration
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in the environment variables")
    }
    await mongoose.connect(mongoURI)
    console.log("MongoDB Connected Successfully")
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message)
    process.exit(1) // Exit process with failure
  }
}

// Create Express App
const app = express()

// Middleware
app.use(helmet()) // Adds security headers
app.use(cors()) // Enable CORS for all origins (can be restricted in production)
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Static file serving for uploads
app.use("/uploads", express.static("uploads"))

// Routes
app.use("/api/users", usersRouter)
app.use("/api/loans", Loanrouter)
app.use("/api/auth", Authrouter)
app.use("/api/admin", Adminrouter)
app.use("/api/appointments", Appointmentrouter)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? undefined : err.message, // Hide error details in production
  })
})

// Server Configuration
const PORT = process.env.PORT || 4000

// Start Server
const startServer = async () => {
  try {
    await connectDB() // Ensure DB connection before starting the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error.message)
    process.exit(1)
  }
}

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...")
  await mongoose.connection.close()
  process.exit(0)
})

startServer()

export default app

