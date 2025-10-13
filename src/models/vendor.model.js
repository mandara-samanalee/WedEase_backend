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


// get all vendors details
export const getAllVendorsDetailsModel = async () => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        services: {
          include: {
            packages: true,
            photos: true,
            bookings: true,
            reviews: {
              include: {
                customer: true, 
              },
            },
          },
        },
      },
    });

    // Transform into desired structure
    const result = vendors.map((v) => ({
      id: v.userId,
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      address: v.address,
      city: v.city,
      disric: v.district,
      province: v.province,
      country: v.country,
      contactNo: v.contactNo,
      isActive: v.services.some((s) => s.isActive),
      joinDate: v.createdAt.toISOString().split('T')[0],
      services: v.services.map((s) => {
        // Calculate average rating
        const totalReviews = s.reviews.length;
        const rating = totalReviews
          ? parseFloat(
              (
                s.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
              ).toFixed(1)
            )
          : 0.0;

        return {
          id: s.serviceId,
          serviceName: s.serviceName,
          category: s.category,
          description: s.description,
          capacity: s.capacity,
          rating,
          totalReviews,
          bookingCount: s.bookings.length,
          packages: s.packages.map((p) => ({
            name: p.packageName,
            price: p.price,
            features: p.features,
          })),
          location: {
            address: s.address,
            city: s.city,
            district: s.district,
            province: s.province,
            country: s.country,
          },
          photos: s.photos.map((p) => p.imageUrl),
          reviews: s.reviews.map((r) => ({
            id: r.id,
            customerName: `${r.customer.firstName} ${r.customer.lastName}`,
            rating: r.rating,
            comment: r.comment,
            date: r.createdAt.toISOString().split('T')[0],
          })),
        };
      }),
    }));

    return result;
  } catch (error) {
    throw new Error(`Error fetching vendors with services: ${error.message}`);
  }
};


// delete vendor 
export const deleteVendorModel = async (userId) => {
  try {
    // Check if vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: { 
        services: { 
            include: { 
                bookings: true, 
                reviews: true, 
                packages: true, 
                photos: true 
            }
        } 
    },
    });

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    //Delete related services data manually 
    for (const service of vendor.services) {
      await prisma.review.deleteMany({ where: { 
        serviceId: service.serviceId 
    } });
      await prisma.booking.deleteMany({ where: { 
        serviceId: service.serviceId 
    } });
      await prisma.servicePackage.deleteMany({ where: { 
        serviceId: service.serviceId 
    } });
      await prisma.servicePhoto.deleteMany({ where: { 
        serviceId: service.serviceId 
    } });
    }

    // Delete services
    await prisma.service.deleteMany({ where: { vendorId: userId } });

    // Delete vendor
    await prisma.vendor.delete({ where: { userId: userId } });

    return { 
        message: 'Vendor and all related data deleted successfully'
    };
  } catch (error) {
    throw new Error(`Error deleting vendor: ${error.message}`);
  }
};
