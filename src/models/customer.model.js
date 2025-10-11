import prisma from "../config/db.js";

// generate customerId
const generateCustomerId = async () => {
    const lastCustomer = await prisma.customer.findFirst({
        orderBy: {
            id: 'desc'
        },
    });

    let nextNumber = 1;
    if (lastCustomer && lastCustomer.userId) {
        const lastNumeric = parseInt(lastCustomer.userId.replace('CUS', ''));
        if (!isNaN(lastNumeric)) {
            nextNumber = lastNumeric + 1;
        }
    }

    const newCustomerId = `CUS${nextNumber.toString().padStart(5, '0')}`;
    return newCustomerId;
};

// create new user
export const createUserModel = async (customerData) => {
    try {
        const userId = await generateCustomerId();

        const newuser = await prisma.User.create({
            data: {
                userId,
                email: customerData.email,
                password: customerData.password,
                role: "CUSTOMER",
            },
        });

        const newcustomer = await prisma.customer.create({
            data: {
                userId,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                email: customerData.email,
            }
        });
        return {newcustomer, newuser};

    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create user");
    }
}

// update customer profile
export const updateCustomerProfileModel = async (userId, updateData) => {
    try {
        // Filter out undefined values to avoid updating with null
        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        const updatedCustomer = await prisma.customer.update({
            where: { userId },
            data: filteredData,
        });
        return updatedCustomer;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update customer profile");
    }
};


// get customer details
export const GetCustomerDetailsModel = async (userId) => {
    try {
        const customerDetails = await prisma.customer.findUnique({
            where: { userId },
        });
        return customerDetails;
    } catch (error) {
        console.error ("Database error:", error);
        throw new Error("Failed to retrieve customer details");
    }
};


// Get all customer details
export const getAllCustomerDetailsModel = async () => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        weddingEvent: {
          include: {
            agenda: true,
            checklist: true,
            budget: true ,
            guests: true,
          },
        },
        bookings: {
          include: {
            service: true,
          },
        },
        reviews: {
          include: {
            service: true,
          },
        },
      },
    });

     // Add totalBookings and totalReviews to each customer
    const formattedCustomers = customers.map((customer) => ({
      ...customer,
      totalBookings: customer.bookings?.length || 0,
      totalReviews: customer.reviews?.length || 0,
    }));

    return formattedCustomers;
  } catch (error) {
    throw new Error(`Error fetching customers: ${error.message}`);
  }
};


// Delete a customer and all related data
export const deleteCustomerAccountModel = async (userId) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { userId },
      include: {
        weddingEvent: {
          include: {
            agenda: true,
            checklist: { include: { subtasks: true } },
            budget: { include: { categories: true } },
            guests: true,
          },
        },
        bookings: true,
        reviews: true,
      },
    });

    if (!customer) throw new Error('Customer not found');

    const eventId = customer.weddingEvent?.id;

    // Delete all event-related data first
    if (eventId) {
      await prisma.checklistSubtask.deleteMany({
        where: { checklist: { eventId } },
      });
      await prisma.weddingChecklist.deleteMany({ where: { eventId } });
      await prisma.weddingAgenda.deleteMany({ where: { eventId } });
      await prisma.budgetCategory.deleteMany({
        where: { Budget: { eventId } },
      });
      await prisma.budget.deleteMany({ where: { eventId } });
      await prisma.rSVP.deleteMany({ where: { eventId } });
      await prisma.weddingEvent.delete({ where: { id: eventId } });
    }

    // Delete customer bookings and reviews
    await prisma.review.deleteMany({ where: { customerId: userId } });
    await prisma.booking.deleteMany({ where: { customerId: userId } });

    // Delete the customer record
    await prisma.customer.delete({ where: { userId } });

    // remove the User account
    await prisma.user.delete({ where: { userId } });

    return { message: 'Customer account and all related data deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting customer account: ${error.message}`);
  }
};


// Get wedding dashboard data by userId
export const getWeddingDashboardByUserIdModel = async (userId) => {
  try {
    // Get the event created by this user
    const event = await prisma.weddingEvent.findUnique({
      where: { createdBy: userId },
      include: {
        guests: true,
        checklist: { 
          include: { subtasks: true } 
        },
        agenda: true,
        budget: {
          include: { categories: true }
        },
      },
    });

    // If no event exists for this user
    if (!event) {
      return {
        eventDetails: null,
        totalGuests: null,
        guestResponseCounts: null,
        taskCompletedPercentage: null,
        bookedServicesSummary: null,
        budgetSummary: null,
        timelineTaskCount: null,
        completedChecklistTasks: null,
      };
    }

    //  1. Total Guest Count
    const totalGuests = event.guests?.length || 0;

    // 2️. Guest Responses Summary
    const guestResponseCounts = event.guests?.length
      ? {
          confirmed: event.guests.filter(g => g.responseStatus === "ACCEPTED").length,
          pending: event.guests.filter(g => g.responseStatus === "PENDING").length,
          declined: event.guests.filter(g => g.responseStatus === "DECLINED").length,
          invited: event.guests.filter(g => g.responseStatus === "INVITED").length,
          prelisted: event.guests.filter(g => g.responseStatus === "PRELISTED").length,
        }
      : null;

    // 3️ Checklist Progress
    const allSubtasks = event.checklist.flatMap(c => c.subtasks);
    const totalSubtasks = allSubtasks.length;
    const completedSubtasks = allSubtasks.filter(s => s.status === "done").length;
    const taskCompletedPercentage =
      totalSubtasks > 0 ? ((completedSubtasks / totalSubtasks) * 100).toFixed(2) : null;

    // 4. Booked Services Summary
    const bookings = await prisma.booking.findMany({
      where: { customerId: userId },
      include: { service: true },
    });

    const bookedServicesSummary = bookings.length
      ? {
          totalBookings: bookings.length,
          accepted: bookings.filter(b => b.status === "ACCEPTED").length,
          pending: bookings.filter(b => ["INTERESTED", "PENDING"].includes(b.status)).length,
          completed: bookings.filter(b => b.status === "COMPLETED").length,
        }
      : null;

    // 5️ Budget Summary
    const budget = event.budget?.[0] || null;
    const budgetSummary = budget
      ? (() => {
          const totalAllocated = budget.categories.reduce(
            (sum, c) => sum + (c.allocatedAmount || 0),
            0
          );
          const totalSpent = budget.categories.reduce(
            (sum, c) => sum + (c.spentAmount || 0),
            0
          );
          return {
            totalBudget: budget.TotalBudget,
            allocatedBudget: totalAllocated,
            spentBudget: totalSpent,
            remainingBudget:
              budget.TotalBudget != null ? budget.TotalBudget - totalSpent : null,
          };
        })()
      : null;

    // 6 Event Details
    const eventDetails = event
      ? {
          title: event.title,
          groomName: event.GroomName,
          brideName: event.BrideName,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          description: event.Description,
          guestCount: event.GuestCount,
        }
      : null;

    // 7️ Timeline Task Count
    const timelineTaskCount = event.agenda?.length || null;

    // 8️ Completed Checklist Tasks
    const completedChecklistTasks =
      event.checklist?.length > 0
        ? event.checklist.filter(c =>
            c.subtasks.length > 0 && c.subtasks.every(s => s.status === "done")
          ).length
        : null;

    // Return final structured summary
    return {
      eventDetails,
      totalGuests,
      guestResponseCounts,
      taskCompletedPercentage,
      bookedServicesSummary,
      budgetSummary,
      timelineTaskCount,
      completedChecklistTasks,
    };
  } catch (error) {
    console.error("Model Error (getWeddingDashboardByUserIdModel):", error);
    throw error;
  }
};

