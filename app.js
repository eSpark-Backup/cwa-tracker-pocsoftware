// Import Express, Mongoose, and Swagger
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config(); // Load environment variables
const Tracker = require("./tracker.schema.js");
const jwt = require("jsonwebtoken"); // Import JWT

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Device Tracker API",
      version: "1.0.0",
      description: "API for tracking devices",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./*.js"], // Matches all .js files in the current directory
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const app = express(); // Initialize Express

// Middleware to parse JSON bodies
app.use(express.json()); // Parse JSON requests

// Use Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger UI

// Define a port
const port = 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema); // Create User model

// Define a route
/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a greeting message
 *     responses:
 *       200:
 *         description: A greeting message
 */
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

/**
 * @openapi
 * '/tracker':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a device
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - deviceId
 *              - deviceName
 *              - location
 *            properties:
 *              deviceId:
 *                type: string
 *                default: 123123
 *              deviceName:
 *                type: string
 *                default: Samsung
 *              location:
 *                type: object
 *                default: {
 *
 *                  coordinates: [-83.935242, 40.730610]
 *                }
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
app.post("/tracker", async (req, res) => {
  const { deviceId, deviceName, location } = req.body;
  location.type = "Point";

  try {
    const existingDevice = await Tracker.findOne({ deviceId });

    if (existingDevice) {
      existingDevice.location = location;
      await existingDevice.save();
      return res
        .status(200)
        .json({ message: "Device location updated", device: existingDevice });
    } else {
      const newDevice = new Tracker({ deviceId, deviceName, location });
      await newDevice.save();
      return res
        .status(201)
        .json({ message: "Device created", device: newDevice });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error saving device", error });
  }
});

// // Define a route for signup
// /**
//  * @swagger
//  * /signup:
//  *   post:
//  *     summary: User signup
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - email
//  *               - password
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: User created
//  *       400:
//  *         description: Bad Request
//  *       500:
//  *         description: Server Error
//  */
// app.post("/signup", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const newUser = new User({ email, password });
//     await newUser.save();

//     // Create JWT token
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     return res.status(201).json({ message: "User created", token });
//   } catch (error) {
//     return res.status(500).json({ message: "Error creating user", error });
//   }
// });

// Define a route for login
/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *     - User Controller
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@chipworks.com"
 *               password:
 *                 type: string
 *                 example: "chipworks"
 *     responses:
 *       200:
 *         description: User logged in
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Here you should compare the password with a hashed version
    // For simplicity, assuming plain text for now
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      Action: "User logged in",
      timestamp: new Date().toISOString(),
      data: { token },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
