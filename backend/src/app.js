const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("./config/passportConfig"); // Initialize Passport config

const app = express();

app.use(cors({
  origin: true, // Auto-reflect request origin, allowing all developer ports
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "your_super_secret_session_key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const dealRoutes = require("./routes/dealRoutes");
const contactRoutes = require("./routes/contactRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const productRoutes = require("./routes/productRoutes");
const workflowRoutes = require("./routes/workflowRoutes");
const documentRoutes = require("./routes/documentRoutes");

// Base route
app.get("/", (req, res) => {
  res.json({ message: "CRM & Project Management API Running..." });
});

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/documents", documentRoutes);

module.exports = app;
