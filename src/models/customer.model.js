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
