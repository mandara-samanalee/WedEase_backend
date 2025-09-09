import express from 'express';
import { 
    CreateWeddingEventController,
    GetWeddingEventController,
    GetWeddingEventsByCreatorController,
    UpdateWeddingEventController,
    DeleteWeddingEventController
} from '../controllers/event.controller.js';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: WeddingEvents
 *   description: Wedding Event management
 */

/**
 * @swagger
 * /wedding-events:
 *   post:
 *     summary: Create a new wedding event
 *     tags: [WeddingEvents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               GroomName: { type: string }
 *               BrideName: { type: string }
 *               date: { type: string, format: date-time }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *               location: { type: string }
 *               Description: { type: string }
 *               GuestCount: { type: integer }
 *               createdBy: { type: string }
 *     responses:
 *       201:
 *         description: Wedding event created successfully
 */
router.post('/create', CreateWeddingEventController);


/**
 * @swagger
 * /wedding-events/{eventId}:
 *   get:
 *     summary: Get wedding event by ID
 *     tags: [WeddingEvents]
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Wedding event details
 *       404:
 *         description: Event not found
 */
router.get("/:eventId", GetWeddingEventController);

/**
 * @swagger
 * /wedding-events/user/{createdBy}:
 *   get:
 *     summary: Get all wedding events by creator
 *     tags: [WeddingEvents]
 *     parameters:
 *       - name: createdBy
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of wedding events created by the user
 *       404:
 *         description: No events found for the user
 */

router.get("/user/:createdBy", GetWeddingEventsByCreatorController);

/**
 * @swagger
 * /wedding-events/{eventId}:
 *   put:
 *     summary: Update wedding event by ID
 *     tags: [WeddingEvents]
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               GroomName: { type: string }
 *               BrideName: { type: string }
 *               date: { type: string, format: date }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *               location: { type: string }
 *               Description: { type: string }
 *               GuestCount: { type: integer }
 *     responses:
 *       200:
 *         description: Wedding event updated successfully
 *       404:
 *         description: Event not found
 */
router.put("/:eventId", UpdateWeddingEventController);

/**
 * @swagger
 * /wedding-events/{eventId}:
 *   delete:
 *     summary: Delete wedding event by ID
 *     tags: [WeddingEvents]
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Wedding event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete("/:eventId", DeleteWeddingEventController);

export default router;

