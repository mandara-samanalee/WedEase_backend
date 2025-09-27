import prisma from "../config/db.js";

// Save guest changes
export const SaveGuestChangesModel = async (eventId, guests) => {
    try {
        await prisma.$transaction(async (tx) => {
            for (const guest of guests) {
                const { id, guestName, phone, Gender, childCount, alcoholPref, mealPref, plus, side, responseStatus, notes } = guest;

                if (id) {
                    await tx.rSVP.update({
                        where: { id },
                        data: {
                            guestName,
                            phone,
                            Gender,
                            childCount,
                            alcoholPref,
                            mealPref,
                            plus,
                            side,
                            responseStatus,
                            notes,
                            updatedAt: new Date(),
                        },
                    });
                } else {
                    await tx.rSVP.create({
                        data: {
                            eventId,
                            guestName,
                            phone,
                            Gender,
                            childCount,
                            alcoholPref,
                            mealPref,
                            plus,
                            side,
                            responseStatus,
                            notes,
                        },
                    });
                }
            }
        });

        return await prisma.rSVP.findMany({ where: { eventId } });
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to save guest changes");
    }
};


// Delete a single guest raw
export const DeleteGuestModel = async (id) => {
    try {
        const deletedGuest = await prisma.rSVP.delete({
            where: { id },
        });
        return deletedGuest;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to delete guest");
    }
};


// Get all guest lists
export const getAllGuestsByuserIdModel = async (userId) => {
    try {
        const guests = await prisma.WeddingEvent.findUnique({
            where: { createdBy:userId },
            include: {
                guests: true,
            },
        });
        
        return guests;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch guests");
    }
};
