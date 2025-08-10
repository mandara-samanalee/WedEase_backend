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