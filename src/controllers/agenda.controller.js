import {
    upsertAgendaItem,
    getAgendaItemsByEvent,
    deleteAgendaItem,
} from "../models/agenda.model.js";

// Create or Update Agenda Item
export const upsertAgendaItemController = async (req, res) => {
    try {
        const { eventId, items } = req.body;

        if (!eventId || !Array.isArray(items)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "eventId and items[] are required",
            });
        }

        const agendaItems = await upsertAgendaItem(eventId, items);

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Agenda item saved successfully",
            data: agendaItems,
        });
    } catch (error) {
        console.error("Upsert Agenda Item Error:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to save agenda item",
            error: error.message
        });
    }
};

// Get All Agenda Items by EventId
export const getAgendaItemsByEventController = async (req, res) => {
    try {
        const { eventId } = req.params;
        const agendaItems = await getAgendaItemsByEvent(eventId);

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Agenda items fetched successfully",
            data: agendaItems,
        });
    } catch (error) {
        console.error("Get Agenda Items Error:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to fetch agenda items",
            error: error.message
        });
    }
};


// Delete Agenda Item
export const deleteAgendaItemController = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteAgendaItem(id);

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Agenda item deleted successfully",
            data: deleted,
        });
    } catch (error) {
        console.error("Delete Agenda Item Error:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to delete agenda item",
            error: error.message
        });
    }
};
