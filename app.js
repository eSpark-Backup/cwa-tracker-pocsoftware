// Import Express, Mongoose, and Swagger
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config(); // Load environment variables
const Tracker = require("./tracker.schema.js");

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
  apis: ["app.js"], // Path to the API docs
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

/**
 * @swagger
 * /tracker:
 *   post:
 *     summary: Add or update a device
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: "12346"
 *               deviceName:
 *                 type: string
 *                 example: "My Device"
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [-83.935242, 40.730610] // Example coordinates for New York City
 *     responses:
 *       200:
 *         description: Device location updated
 *       201:
 *         description: Device created
 *       500:
 *         description: Error saving device
 */

// Define a POST route to add or update a device
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

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
