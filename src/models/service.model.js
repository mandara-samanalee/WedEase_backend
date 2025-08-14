import prisma from "../config/db.js";
import cloudinary from '../config/cloudinary.js';

// Function to generate service ID
export function generateServiceId(vendorId) {
    const numericPart = vendorId.replace(/\D/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    let serviceId = `SRV/${randomNum}/${numericPart}`;
    return serviceId;
}

// create new service
export const createServiceModel = async (serviceData, files) => {
    const {
        vendorId,
        serviceName,
        category,
        description,
        capacity,
        latitude,
        longitude,
        country,
        state,
        district,
        city,
        address,
        packages,
    } = serviceData;

    // Validate required fields
    if (!vendorId || !serviceName || !category) {
        throw new Error("vendorId, serviceName, and category are required");
    }

    // Convert latitude and longitude
    const latitudeNumber = latitude ? parseFloat(latitude) : undefined;
    const longitudeNumber = longitude ? parseFloat(longitude) : undefined;

    // Additional validation
    if (latitudeNumber && (latitudeNumber < -90 || latitudeNumber > 90)) {
        throw new Error("Invalid latitude value");
    }
    if (longitudeNumber && (longitudeNumber < -180 || longitudeNumber > 180)) {
        throw new Error("Invalid longitude value");
    }
    if (packages && !Array.isArray(packages)) {
        throw new Error("Packages must be an array");
    }

    // Check if vendor exists
    const vendorExists = await prisma.vendor.findUnique({
        where: { userId: vendorId },
    });
    if (!vendorExists) {
        throw new Error("Vendor not found");
    }

    // Generate serviceId
    const serviceId = generateServiceId(vendorId);
    console.log("Generated serviceId:", serviceId)

    // Upload photos to Cloudinary
    const uploadedPhotos = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const url = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "service_media" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }
                );
                uploadStream.end(file.buffer);
            });
            uploadedPhotos.push(url);
        }
    }

    // Prepare data for Prisma create
    const data = {
        serviceId,
        vendorId,
        serviceName,
        category,
        description,
        capacity,
        latitude: latitudeNumber,
        longitude: longitudeNumber,
        country,
        state,
        district,
        city,
        address,
        packages: {
            create: packages?.map((pkg) => ({
                packageName: pkg.packageName,
                price: pkg.price ? parseFloat(pkg.price) : null,
                features: pkg.features,
            })),
        },
        photos: uploadedPhotos.length
            ? {
                create: uploadedPhotos.map((url) => ({ imageUrl: url })),
            }
            : undefined,
    };

    // Create service
    console.log("Creating service with data:", JSON.stringify(data, null, 2));
    const service = await prisma.service.create({
        data,
        include: { packages: true, photos: true, vendor: true },
    });

    return service;
};