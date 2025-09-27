import express from 'express';
import { 
    SaveGuestChangesController, 
    DeleteGuestController, 
    getAllGuestsByuserIdController 
} from '../controllers/rsvp.controller.js';

const router = express.Router();

router.post('/save-changes', SaveGuestChangesController);
router.delete('/delete/:id', DeleteGuestController);
router.get('/get-all-guests/:userId', getAllGuestsByuserIdController);

export default router;