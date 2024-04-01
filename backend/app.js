const express = require("express");
const connectDB = require("./config/db.js");
const userRouter = require("./routes/userRoute.js");
const cors = require("cors"); // Import cors
const authenticateUser = require("./middlewares/authenticateUser.js");
const authorizeUser = require("./middlewares/authorizeUser.js");
const createOrder = require("./controllers/paymentController.js");
const {
  createCommittee,
  joinCommittee,
} = require("./controllers/committeeController.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Function to connect to mongodb database
connectDB();

// This middleware helps parse that JSON data and make it available in the req.body object of your route handlers.
app.use(cors()); // Enable CORS for all routes

app.use(express.json());

app.get("/test", (req, res) => {
  res.status(200).json({ msg: "Server is UP. working perfectly fine" });
});

// User Routes
app.use("/auth", userRouter);

// Apply authentication middleware to protected routes
app.use("/user", authenticateUser, (req, res) => {
  // Handle protected route logic here
});

// Apply authorization middleware to restricted routes
app.use("/admin", authenticateUser, authorizeUser("admin"), (req, res) => {
  // Handle admin-only route logic here
});

// payment api
app.post("/createOrder", (req, res) => {
  return createOrder(req, res);
});

app.post("/createCommittee", (req, res) => {
  return createCommittee(req, res);
});
app.post("/requestToJoin", (req, res) => {
  return joinCommittee(req, res);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀Server is running on port ${PORT}`);
});
