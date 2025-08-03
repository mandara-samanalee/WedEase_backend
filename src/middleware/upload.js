// middleware/upload.js
import multer from 'multer';

// Store file in memory (RAM) instead of saving to disk
const storage = multer.memoryStorage();

// Configure multer to use this storage
export const upload = multer({ storage });
