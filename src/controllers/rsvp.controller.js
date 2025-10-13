import { 
    SaveGuestChangesModel,
    DeleteGuestModel,
    getAllGuestsByuserIdModel
} from "../models/rsvp.model.js";

//Save guest changes
export const SaveGuestChangesController = async (req, res) => {
    try {
        const { eventId, guests } = req.body;

        if (!eventId) {
            return res.status(400).json({
                code: 400,
                status: "false",
                message: "eventId is required",
                data: null,
            });
        }
        if (!guests || !Array.isArray(guests)) {
            return res.status(400).json({
                code: 400,
                status: "false",
                message: "guests array is required",
                data: null,
            });
        }
        for (const guest of guests) {
            if (!guest.guestName) {
                return res.status(400).json({
                    code: 400,
                    status: "false",
                    message: "GuestName is required for each guest",
                    data: null,
                });
            }
            if (guest.responseStatus && !['PRELISTED', 'INVITED', 'PENDING', 'ACCEPTED', 'DECLINED'].includes(guest.responseStatus)) {
                return res.status(400).json({
                    code: 400,
                    status: "false",
                    message: "Invalid response Status value",
                    data: null,
                });
            }
        }

        const GuestList = await SaveGuestChangesModel(eventId, guests);
        return res.status(200).json({
            code: 200,
            status: "true",
            message: "Changes saved successfully",
            data: GuestList,
        });
    } catch (error) {
        console.error("Error saving guest changes:", error);
        return res.status(500).json({
            code: 500,
            status: "false",
            message: "Internal server error",
            data: null,
        });
    }
};


// delete the single guest raw
export const DeleteGuestController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                code: 400,
                status: "false",
                message: "id is required",
                data: null,
            });
        }

        const deletedGuest = await DeleteGuestModel(parseInt(id));
        if (!deletedGuest) {
            return res.status(404).json({
                code: 404,
                status: "false",
                message: "Guest not found",
                data: null,
            });
        }

        return res.status(200).json({
            code: 200,
            status: "true",
            message: "Guest deleted successfully",
            data: null,
        });
    } catch (error) {
        console.error("Error deleting guest:", error);
        return res.status(500).json({
            code: 500,
            status: "false",
            message: "Internal server error",
            data: null,
        });
    }
};


// Get guest lists by eventId
export const getAllGuestsByuserIdController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                code: 400,
                status: "false",
                message: "userId is required",
                data: null,
            });
        }
    
        const guests = await getAllGuestsByuserIdModel(userId);
        return res.status(200).json({
            code: 200,
            status: "true",
            message: "Guests retrieved successfully",
            data: guests,
        });
    } catch (error) {
        console.error("Error retrieving guests:", error);
        return res.status(500).json({
            code: 500,
            status: "false",
            message: "Internal server error",
            data: null,
        });
    }
}
