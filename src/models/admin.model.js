import prisma from '../config/db.js';

// Update Admin profile
export const updateAdminProfileModel = async (userId, data) => {
    try {
        const { firstName, lastName, email, contactNo, designation, image } = data;

        const existingAdmin = await prisma.admin.findUnique({ where: { userId } });
        if (!existingAdmin) {
            throw new Error("Admin not found");
        }

        const updatedAdmin = await prisma.$transaction(async (tx) => {
            const admin = await tx.admin.update({
                where: { userId },
                data: {
                    firstName,
                    lastName,
                    email,
                    contactNo,
                    designation,
                    image,
                },
            });

            // update user table email 
            if (email) {
                await tx.user.updateMany({
                    where: { userId },
                    data: { email },
                });
            }

            return admin;
        });

        return updatedAdmin;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to update admin profile");
    }
};


// get admin details
export const GetAdminProfileModel = async (userId) => {
    try {
        const adminDetails = await prisma.admin.findUnique({
            where: { userId },
        });
        return adminDetails;
    } catch (error) {
        console.error ("Database error:", error);
        throw new Error("Failed to retrieve customer details");
    }
};


// get dashboard summary counts
export const getDashboardSummaryModel = async () => {
  try {
    // Count total customers
    const totalCustomers = await prisma.customer.count();

    // Count total vendors
    const totalVendors = await prisma.vendor.count();

    // Count total events
    const totalEvents = await prisma.weddingEvent.count();

    // Count total services
    const totalServices = await prisma.service.count();

    // Count bookings (exclude interested and cancelled)
    const totalBookings = await prisma.booking.count({
      where: {
        status: {
          in: ['COMPLETED', 'PENDING', 'CONFIRMED'], // only these statuses
        },
      },
    });

    return {
      totalCustomers,
      totalVendors,
      totalEvents,
      totalServices,
      totalBookings,
    };
  } catch (error) {
    throw new Error(`Error fetching dashboard summary: ${error.message}`);
  }
};


// get newly registered customers and vendors in past three months
export const getRecentRegistrationsModel = async () => {
  try {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 2); // include current + past 2 months (3 total)

    // fetch users created in last 3 months
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(threeMonthsAgo.getFullYear(), threeMonthsAgo.getMonth(), 1),
        },
      },
      select: {
        role: true,
        createdAt: true,
      },
    });

    // month name formatter
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' });

    // prepare structure for last 3 months
    const months = [];
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = formatter.format(date);
      months.push(monthName);
    }

    // initialize data map
    const monthlyData = months.map((month) => ({
      month,
      customers: 0,
      vendors: 0,
    }));

    // process users
    users.forEach((user) => {
      const monthName = formatter.format(user.createdAt);
      const entry = monthlyData.find((m) => m.month === monthName);
      if (entry) {
        if (user.role === 'CUSTOMER') entry.customers += 1;
        if (user.role === 'VENDOR') entry.vendors += 1;
      }
    });

    return monthlyData;
  } catch (error) {
    throw new Error(`Error fetching monthly registrations: ${error.message}`);
  }
};


// get the service count under each service category
export const getServiceCountsByCategoryModel = async () => {
   try {
    // Group services by category and count them
    const serviceCounts = await prisma.service.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    // Format result
    const result = serviceCounts.map((item) => ({
      category: item.category || 'Uncategorized',
      totalServices: item._count.category,
    }));

    return result;
  } catch (error) {
    throw new Error(`Error fetching service counts by category: ${error.message}`);
  }
};


// get the most booked services
export const getTopBookedServicesModel = async () => {
  try {
    // Count bookings per service (excluding INTERESTED and CANCELLED)
    const bookingCounts = await prisma.booking.groupBy({
      by: ['serviceId'],
      _count: {
        serviceId: true,
      },
      where: {
        status: {
          in: ['COMPLETED', 'CONFIRMED', 'PENDING'], // only valid bookings
        },
      },
      orderBy: {
        _count: {
          serviceId: 'desc',
        },
      },
      take: 3, // only top 3
    });

    // Extract service IDs
    const serviceIds = bookingCounts.map((b) => b.serviceId);

    // Fetch related service and vendor info
    const services = await prisma.service.findMany({
      where: {
        serviceId: {
          in: serviceIds,
        },
      },
      include: {
        vendor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Merge booking count with service details
    const result = bookingCounts.map((booking) => {
      const service = services.find((s) => s.serviceId === booking.serviceId);
      return {
        serviceName: service?.serviceName,
        category: service?.category || 'Uncategorized',
        vendorName: service ? `${service.vendor.firstName} ${service.vendor.lastName}` : 'Unknown Vendor',
        bookingCount: booking._count.serviceId,
      };
    });

    return result;
  } catch (error) {
    throw new Error(`Error fetching top booked services: ${error.message}`);
  }
};


// get the top rated services
export const getTopRatedServicesModel = async () => {
  try {
    // Group reviews by serviceId to get average rating and review count
    const reviews = await prisma.review.groupBy({
      by: ['serviceId'],
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
      orderBy: {
        _avg: {
          rating: 'desc',
        },
      },
      take: 3, // top 3 rated services
    });

    const serviceIds = reviews.map((r) => r.serviceId);

    // Fetch related service and vendor details
    const services = await prisma.service.findMany({
      where: {
        serviceId: {
          in: serviceIds,
        },
      },
      include: {
        vendor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Merge data together
    const result = reviews.map((r) => {
      const service = services.find((s) => s.serviceId === r.serviceId);

      return {
        serviceName: service?.serviceName,
        category: service?.category || 'Uncategorized',
        vendorName: service && service.vendor ? `${service.vendor.firstName} ${service.vendor.lastName}` : 'Unknown Vendor',
        reviewCount: r._count.rating,
        averageRating: r._avg.rating ? parseFloat(r._avg.rating.toFixed(1)) : 0.0,
      };
    });

    // Sort again in case of rating ties
    result.sort((a, b) => b.averageRating - a.averageRating);

    return result;
  } catch (error) {
    throw new Error(`Error fetching top rated services: ${error.message}`);
  }
};
