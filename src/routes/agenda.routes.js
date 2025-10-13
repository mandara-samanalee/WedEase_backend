import express from "express";
import {
  upsertAgendaItemController,
  getAgendaItemsByEventController,
  deleteAgendaItemController,
} from "../controllers/agenda.controller.js";

const router = express.Router();


router.post("/save", upsertAgendaItemController);
router.get("/:eventId", getAgendaItemsByEventController);
router.delete("/delete-item/:id", deleteAgendaItemController);

export default router;
