// Import Express, Mongoose, and Swagger
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config(); // Load environment variables
const Tracker = require("./tracker.schema.js");
const jwt = require("jsonwebtoken"); // Import JWT
const cors = require("cors"); // Import CORS
const helmet = require("helmet");
const otplib = require("otplib"); // Ensure you have otplib installed
const qrcode = require("qrcode"); // Ensure you have qrcode installed
const { generateToken, authenticateUser } = require("./authenticator"); // Import the authenticator
const { paginate } = require("./utils/functions"); // Import the paginate function
const axios = require("axios");

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
      {
        url: "https://api.chipworksarabia.com",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./*.js"], // Matches all .js files in the current directory
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const app = express(); // Initialize Express

// Middleware to parse JSON bodies
app.use(express.json()); // Parse JSON requests

// Determine the environment
const isProduction = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV);

// Use CORS middleware with environment-specific settings
app.use(
  cors({
    origin: isProduction ? process.env.HTTPS_URL : process.env.HTTP_URL, // Use HTTP_URL for development
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Use Helmet middleware
app.use(helmet());

// Use Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger UI

// Define a port from env file
const port = process.env.PORT || 3000;

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
  name: { type: String, required: true },
  secret: { type: String, required: false },
  is2FAEnabled: { type: Boolean, default: false },
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tracker" }], // Link to Tracker
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
 * @swagger
 * /devices:
 *   get:
 *     tags:
 *     - Device Controller
 *     summary: Get devices for the authenticated user
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: Devices retrieved successfully
 *       404:
 *         description: No devices found for the user
 *       500:
 *         description: Error retrieving devices
 */
app.get("/devices", authenticateUser, async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
  const query = { user: req.user.id }; // Query to find devices for the authenticated user

  try {
    const paginatedDevices = await paginate(
      Tracker,
      parseInt(page),
      parseInt(limit),
      query
    );

    if (!paginatedDevices.items.length) {
      return res
        .status(404)
        .json({ message: "No devices found for this user." });
    }

    return res.status(200).json(paginatedDevices);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving devices", error });
  }
});

/**
 * @openapi
 * '/tracker':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a device
 *     security:
 *      - BearerAuth: []
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
app.post("/tracker", authenticateUser, async (req, res) => {
  const { deviceId, deviceName, location } = req.body;
  location.type = "Point";

  try {
    // Check if the device already exists for the user

    const existingDevice = await Tracker.findOne({
      deviceId,
    });

    if (existingDevice) {
      if (existingDevice.user._id.toString() !== req.user.id) {
        return res.status(403).json({
          message:
            "This device belongs to another user. Please use a different device or login to your own account.",
        });
      }
      existingDevice.location = location;
      await existingDevice.save();

      await triggerWebhook({
        eventType: "location_update",
        device: existingDevice,
      });
      return res
        .status(200)
        .json({ message: "Device location updated", device: existingDevice });
    } else {
      const newDevice = new Tracker({
        deviceId,
        deviceName,
        location,
        user: req.user.id,
      });
      await newDevice.save();

      await triggerWebhook({
        eventType: "device_created",
        device: newDevice,
      });
      return res
        .status(201)
        .json({ message: "Device created", device: newDevice });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error saving device", error });
  }
});

app.post("/webhook", (req, res) => {
  const event = req.body;

  // Process the event (you can add specific logic based on event type)

  // Respond to acknowledge receipt
  res.status(200).send(event);
});

async function triggerWebhook(payload) {
  const webhookUrl = "http:localhost:3000/webhook"; // Your webhook endpoint
  try {
    await axios.post(webhookUrl, payload);
    console.log("Webhook triggered:", payload);
  } catch (error) {
    console.error(
      "Error triggering webhook:",
      error.response?.data || error.message
    );
  }
}
// Define a route for signup
/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *     - User Controller
 *     summary: User signup
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
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    //find if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ email, password, name });
    await newUser.save();

    // Create JWT token
    const token = generateToken(newUser._id);

    return res.status(201).json({
      message: "User created",
      token,
      email: email,
      name: name,

      is2FAEnabled: false,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user", error });
  }
});

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
    const token = generateToken(user._id);

    return res.status(200).json({
      Action: "User logged in",
      timestamp: new Date().toISOString(),
      data: {
        token,
        name: user.name,
        email: user.email,
        is2FAEnabled: user.is2FAEnabled,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
});

// Define the generateQRCode endpoint
/**
 * @swagger
 * /generate-qr:
 *   post:
 *     tags:
 *     - User Controller
 *     summary: Generate QR code for 2FA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 secret:
 *                   type: string
 *                 qrCode:
 *                   type: string
 *       500:
 *         description: Error generating QR code
 */
const generateQRCode = async (req, res) => {
  try {
    // Generate a secret
    const secret = otplib.authenticator.generateSecret();

    // Create otpauth URL for QR code scanning
    const otpauthUrl = otplib.authenticator.keyuri(
      req.body.email,
      process.env.ISSUER,
      secret
    );
    await User.updateOne({ email: req.body.email }, { $set: { secret } });

    // Generate QR code from otpauth URL
    const qrCode = await qrcode.toDataURL(otpauthUrl);

    // Return the secret and QR code
    return res.json({
      message: "QR code generated successfully",
      secret, // Store this secret in your database for verification
      qrCode, // This can be displayed in the frontend
    });
  } catch (error) {
    return res.status(500).json({ error: "Error generating QR code" });
  }
};

// Add the endpoint to your Express app
app.post("/generate-qr", generateQRCode);

// Define a route for verifying the token
/**
 * @swagger
 * /verify-token:
 *   post:
 *     tags:
 *     - User Controller
 *     summary: Verify token for 2FA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               token:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Token verified successfully
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Error verifying token
 */
app.post("/verify-token", async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.secret) {
      return res
        .status(401)
        .json({ message: "Invalid request or secret not found" });
    }

    const isValid = otplib.authenticator.check(token, user.secret);

    if (isValid) {
      user.is2FAEnabled = true;
      await user.save();

      return res.status(200).json({ message: "Token verified successfully" });
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error verifying token", error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
