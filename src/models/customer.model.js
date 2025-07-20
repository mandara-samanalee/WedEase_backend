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

        const newuser = await prisma.user.create({
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

// find user by email
export const findUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        return user;
    } catch (error) {
        throw new Error("Failed to find user by email");
    }
}