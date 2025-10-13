import { 
    createWeddingEvent,
    getWeddingEventById,
    getWeddingEventsByCreator,
    updateWeddingEvent,
    deleteWeddingEvent
} from '../models/event.model.js';

//create new wedding event
export const CreateWeddingEventController = async (req, res) => {
    try {
        const eventData = req.body;

        if (!eventData || Object.keys(eventData).length === 0) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: 'No data provided to create a wedding event.',
            });
        }
        const newEvent = await createWeddingEvent(eventData);
        return res.status(201).json({
            success: true,
            code: 201,
            message: 'Wedding event created successfully.',
            data: newEvent,
        });
    } catch (error) {
        console.error('Error creating wedding event:', error);
        return res.status(500).json({
            success: false,
            code: 500,
            message: 'An error occurred while creating the wedding event.'
        });
    }
};


// get wedding event by ID
export const GetWeddingEventController = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: 'Event ID is required.',
            });
        }
        const event = await getWeddingEventById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: 'Wedding event not found.',
            });
        }
        return res.status(200).json({
            success: true,
            code: 200,
            message: 'Wedding event retrieved successfully.',
            data: event,
        });
    } catch (error) {
        console.error('Error getting wedding event:', error);
        return res.status(500).json({
            success: false,
            code: 500,
            message: 'An error occurred while retrieving the wedding event.'
        });
    }
};


//get events by creator userId
export const GetWeddingEventsByCreatorController = async (req, res) => {
    try {
        const { createdBy } = req.params;
        if (!createdBy) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: 'Created by parameter is required.',
            });
        }
        const events = await getWeddingEventsByCreator(createdBy);
        if (!events || events.length === 0) {
            return res.status(404).json({
                success: true,
                code: 404,
                message: 'No wedding events found for the specified user.',
            });
        }
        return res.status(200).json({
            success: true,
            code: 200,
            message: 'Wedding events retrieved successfully.',
            data: events,
        });
    } catch (error) {
        console.error('Error getting wedding events:', error);
        return res.status(500).json({
            success: false,
            code: 500,
            message: 'An error occurred while retrieving the wedding events.'
        });
    }
};


// update wedding event
export const UpdateWeddingEventController = async (req, res) => {
    try {
        const { eventId } = req.params;
        const eventData = req.body;
        if (!eventId) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: 'Event ID is required.',
            });
        }

        if (!eventData || Object.keys(eventData).length === 0) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: 'No data provided to update the wedding event.',
            });
        }

        const updatedEvent = await updateWeddingEvent(eventId, eventData);

        return res.status(200).json({
            success: true,
            code: 200,
            message: 'Wedding event updated successfully.',
            data: updatedEvent,
        });
    } catch (error) {
        console.error('Error updating wedding event:', error);
        return res.status(500).json({
            success: false,
            code: 500,
            message: 'An error occurred while updating the wedding event.'
        });
    }
};

// delete wedding event
export const DeleteWeddingEventController = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: 'Event ID is required.',
            });
        }
        await deleteWeddingEvent(eventId);
        return res.status(200).json({
            success: true,
            code: 200,
            message: 'Wedding event deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting wedding event:', error);
        return res.status(500).json({
            success: false,
            code: 500,
            message: 'An error occurred while deleting the wedding event.'
        });
    }
};



