import prisma from "../config/db.js";

// generate vendorId
const generateVendorId = async () => {
    const lastVendor = await prisma.Vendor.findFirst({
        orderBy: {
            id: 'desc'
        },
    });

    let nextNumber = 1;
    if (lastVendor && lastVendor.userId) {
        const lastNumericPart = parseInt(lastVendor.userId.replace('VEN', ''));
        if (!isNaN(lastNumericPart)) {
            nextNumber = lastNumericPart + 1;
        }
    }

    const newVendorId = `VEN${nextNumber.toString().padStart(5, '0')}`;
    return newVendorId;
}

// create new user
export const createVendorModel = async (vendorDetails) => {
    try {
        const userId = await generateVendorId();

        const newuser = await prisma.User.create({
            data: {
                userId,
                email: vendorDetails.email,
                password: vendorDetails.password,
                role: "VENDOR",
            },
        });

        const newvendor = await prisma.Vendor.create({
            data: {
                userId,
                firstName: vendorDetails.firstName,
                lastName: vendorDetails.lastName,
                email: vendorDetails.email,
                address: vendorDetails.address,
                city: vendorDetails.city,
                contactNo: vendorDetails.contactNo,
            }
        });
        return { newvendor, newuser };

    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to create user");
    }
}

// update vendor profile
export const updateVendorProfileModel = async (userId, updatedData) => {
    try {
        // Filter out undefined values to avoid updating with null
        const filteredData = Object.fromEntries(
            Object.entries(updatedData).filter(([_, value]) => value !== undefined)
        );

        const updatedVendor = await prisma.Vendor.update({
            where: { userId },
            data: filteredData,
        });
        return updatedVendor;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update vendor profile");
    }
};

// get vendor details
export const GetVendorDetailsModel = async (userId) => {
    try {
        const vendorDetails = await prisma.Vendor.findUnique({
            where: { userId },
        });
        return vendorDetails;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to retrieve vendor details");
    }
};