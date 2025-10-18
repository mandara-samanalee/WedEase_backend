import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import routes from './src/routes/index.js';
import { setupSwagger } from './src/config/swagger.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Make io globally accessible (for notifications)
global.io = io;

io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // User joins their room (identified by userId)
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their personal room`);
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ======> ${req.url}`);
    next();
});

setupSwagger(app);
app.use("/api", routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
