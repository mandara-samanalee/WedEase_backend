import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import routes from './src/routes/index.js';
import { setupSwagger } from './src/config/swagger.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

connectDB();
const app = express();

app.use(cors()); // Ensure frontend requests aren't blocked
app.use(express.json()); // parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded request bodies

// Logs HTTP method and URL for every incoming request
app.use((req, res, next) => {
    console.log(`${req.method} ======> ${req.url}`);
    next();
})

// setup Swagger 
setupSwagger(app);

app.use("/api", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


