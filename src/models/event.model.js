import prisma from "../config/db.js";

// create new wedding event
export const createWeddingEvent = async (data) => {
    try {
        const event = await prisma.weddingEvent.create({
            data: {
                title: data.title || null,
                GroomName: data.GroomName || null,
                BrideName: data.BrideName || null,
                date: data.date ? new Date(data.date) : null,
                startTime: data.startTime ? new Date(data.startTime) : null,
                endTime: data.endTime ? new Date(data.endTime) : null,
                location: data.location || null,
                Description: data.Description || null,
                GuestCount: data.GuestCount || null,
                createdBy: data.createdBy || null,
            },
        });
        return event;
    } catch (error) {
        throw new Error(`Error creating wedding event: ${error.message}`);
    }
}; 


// get wedding event by ID
export const getWeddingEventById = async (eventId) => {
    try {
        const event = await prisma.weddingEvent.findUnique({
            where: { id: eventId },
            include: {
                agenda: true,
                checklist: {
                    include: {
                        subtasks: true
                    }
                },
                budget: true,
                guests: true,
            }
        });
        return event;
    } catch (error) {
        throw new Error(`Error fetching wedding event: ${error.message}`);
    }
};

// get all wedding events by creator
export const getWeddingEventsByCreator = async (createdBy) => {
    try {
        const events = await prisma.weddingEvent.findMany({
            where: { createdBy },
            include: {
                agenda: true,
                checklist: {
                    include: {
                        subtasks: true
                    }
                },
                budget: true,
                guests: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return events;
    } catch (error) {
        throw new Error(`Error fetching wedding events: ${error.message}`);
    }
};


// update wedding event
export const updateWeddingEvent = async (eventId, data) => {
    try {
        const updatedEvent = await prisma.weddingEvent.update({
            where: { id: eventId },
            data: {
                title: data.title !== undefined ? data.title : undefined,
                GroomName: data.GroomName !== undefined ? data.GroomName : undefined,
                BrideName: data.BrideName !== undefined ? data.BrideName : undefined,
                date: data.date ? new Date(data.date) : undefined,
                startTime: data.startTime ? new Date(data.startTime) : undefined,
                endTime: data.endTime ? new Date(data.endTime) : undefined,
                location: data.location !== undefined ? data.location : undefined,
                Description: data.Description !== undefined ? data.Description : undefined,
                GuestCount: data.GuestCount !== undefined ? parseInt(data.GuestCount) : undefined,
            },
            include: {
                agenda: true,
                checklist: {
                    include: {
                        subtasks: true
                    }
                },
                budget: true,
                guests: true,
            }
        });
        return updatedEvent;
    } catch (error) {
        throw new Error(`Error updating wedding event: ${error.message}`);
    }
};

// delete wedding event
export const deleteWeddingEvent = async (eventId) => {
    try {
        await prisma.weddingAgenda.deleteMany({
            where: { eventId: eventId }
        });
        
        await prisma.checklistSubtask.deleteMany({
            where: { checklist: { eventId: eventId } }
        });
        
        await prisma.weddingChecklist.deleteMany({
            where: { eventId: eventId }
        });
        
        await prisma.budget.deleteMany({
            where: { eventId: eventId }
        });
        
        await prisma.rSVP.deleteMany({
            where: { eventId: eventId }
        });

        // Delete the main event
        const deletedEvent = await prisma.weddingEvent.delete({
            where: { id: eventId }
        });
        
        return deletedEvent;
    } catch (error) {
        throw new Error(`Error deleting wedding event: ${error.message}`);
    }
};

