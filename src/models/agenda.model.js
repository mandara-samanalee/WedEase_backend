import prisma from "../config/db.js";


// Create or Update Agenda Items with Unique Order
export const upsertAgendaItem = async (eventId, items) => {
  if (!eventId || !Array.isArray(items)) {
    throw new Error("Invalid input: eventId and items array are required");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const updates = [];
      const creates = [];
      const itemIds = items.filter(item => item.id).map(item => Number(item.id));

      const maxOrderItem = await tx.weddingAgenda.findFirst({
        where: { eventId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });

      let nextOrder = (maxOrderItem?.order || 0) + 1;

      // Check if all items to update actually exist
      if (itemIds.length > 0) {
        const existingItems = await tx.weddingAgenda.findMany({
          where: {
            id: { in: itemIds },
            eventId: eventId
          },
          select: { id: true, order: true }
        });

        const existingIds = existingItems.map(item => item.id);
        const missingIds = itemIds.filter(id => !existingIds.includes(id));

        if (missingIds.length > 0) {
          throw new Error(`Agenda items not found: ${missingIds.join(', ')}`);
        }
      }

      // Create a map of existing orders for updates
      const existingOrderMap = new Map();
      if (itemIds.length > 0) {
        const existingItemsWithOrder = await tx.weddingAgenda.findMany({
          where: {
            id: { in: itemIds },
            eventId: eventId
          },
          select: { id: true, order: true }
        });
        existingItemsWithOrder.forEach(item => existingOrderMap.set(item.id, item.order));
      }

      // Separate updates and creates
      for (const item of items) {
        const { id, Activity, startTime, endTime, location, notes, order } = item;

        if (!Activity) {
          throw new Error(`Missing required fields for agenda item: ${Activity || 'Unknown'}`);
        }

        if (id) {
          updates.push(
            tx.weddingAgenda.update({
              where: { id: Number(id) },
              data: {
                Activity,
                startTime,
                endTime,
                location,
                notes,
                order: order || existingOrderMap.get(Number(id)),
              },
            })
          );
        } else {
          creates.push(
            tx.weddingAgenda.create({
              data: {
                eventId,
                Activity,
                startTime,
                endTime,
                location,
                notes,
                order: nextOrder++, 
              },
            })
          );
        }
      }

      // Execute all operations
      const updateResults = await Promise.all(updates);
      const createResults = await Promise.all(creates);

      return [...updateResults, ...createResults];
    }, {
      // Increase timeout for large batches
      timeout: 10000,
    });
  } catch (error) {
    console.error("Error in upsertAgendaItem:", error);
    
    if (error.message.includes('Agenda items not found') || 
        error.message.includes('Missing required fields')) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create or update agenda items. All changes have been rolled back.");
    }
  }
};


// Get all Agenda Items by Event ID
export const getAgendaItemsByEvent = async (eventId) => {
    try {
        return await prisma.weddingAgenda.findMany({
            where: { eventId },
            orderBy: { order: "asc" }, 
        });
    } catch (error) {
        console.error("Error in getAgendaItemsByEvent:", error);
        throw new Error("Failed to fetch agenda items");
    }
};


// Delete Agenda Item
export const deleteAgendaItem = async (id) => {
    try {
        return await prisma.weddingAgenda.delete({
            where: { id: Number(id) },
        });
    } catch (error) {
        console.error("Error in deleteAgendaItem:", error);
        throw new Error("Failed to delete agenda item");
    }
};
