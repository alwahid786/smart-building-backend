import createHttpError from "http-errors";
import { TryCatch } from "../../utils/tryCatch.js";
import { Building } from "../../models/buildingModel/building.model.js";
import { NextFunction, Request, Response } from "express";
import { BuildingSchemaTypes } from "../../types/buildingTypes.js";
import { v2 as cloudinary } from 'cloudinary';
import { Image } from "../../models/imagesModel/images.model.js";

// Define an interface for a single Multer file object
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Define a type for the `files` property which can be an array or an object
type MulterFiles = MulterFile[] | { [fieldname: string]: MulterFile[] };

export const addBuilding = TryCatch(
  async (req: Request<{}, {}, BuildingSchemaTypes>, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    // Type assertion for req.files
    const files = req.files as unknown as MulterFiles;

    let imageUrls: string[] = [];

    if (!files) {
      return next(createHttpError(400, "Building images are required"));
    }

    // Helper function to upload a file to Cloudinary
    const uploadToCloudinary = async (file: MulterFile) => {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "buildings" // Specify a folder in your Cloudinary account
        });
        return result.secure_url; // Return the secure URL of the uploaded file
      } catch (error) {
        throw new Error("Failed to upload image to Cloudinary");
      }
    };

    // Upload each file to Cloudinary and collect URLs
    if (Array.isArray(files)) {
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        imageUrls.push(url);
      }
    } else {
      for (const key in files) {
        if (Array.isArray(files[key])) {
          for (const file of files[key]) {
            const url = await uploadToCloudinary(file);
            imageUrls.push(url);
          }
        }
      }
    }

    const {
      buildingName,
      ownerName,
      mobile,
      email,
      totalArea,
      numberOfFloors,
      description,
      writtenAddress,
    } = req.body;

    // Validate all fields
    if (
      !buildingName ||
      !ownerName ||
      !mobile ||
      !email ||
      !totalArea ||
      !description ||
      !numberOfFloors ||
      !writtenAddress
    ) {
      return next(createHttpError(400, "All fields are required"));
    }

    // Create building
    const building = await Building.create({
      buildingName,
      ownerName,
      ownerId: userId,
      mobile,
      email,
      totalArea,
      description,
      numberOfFloors,
      writtenAddress,
      buildingImages: imageUrls,
    });

    // Create images in Image model associated with the building
    await Image.create({ buildingId: building._id, images: imageUrls });

    // Success response
    return res.status(201).json({ success: true, message: "Building created successfully", data: building });
  }
);

// get all buildings
export const getAllBuildings = TryCatch(async (req, res, next) => {
  const usreId = req.user?._id;

  const building = await Building.find({ ownerId: usreId });


  if (building.length < 1) {
    return res.status(400).json({ message: "Opps empty building" });
  }

  return res.status(200).json(building);
});

// get single building
export const getSingleBuilding = TryCatch(async (req, res, next) => {

  const { id } = req.params;

  const building = await Building.findOne({ _id: id });


  return res.status(200).json(building);
});

// update building
export const updateBuilding = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const {
    buildingName,
    ownerName,
    mobile,
    email,
    totalArea,
    description,
    numberOfFloors,
    // constructionYear,
    writtenAddress,
  } = req.body;
  if (
    !buildingName ||
    !ownerName ||
    !mobile ||
    !email ||
    !totalArea ||
    !description ||
    !numberOfFloors ||
    // !constructionYear ||
    !writtenAddress
  ) {
    return next(createHttpError(400, "All fields are required"));
  }
  const building = await Building.findByIdAndUpdate(id, {
    buildingName,
    ownerName,
    mobile,
    email,
    totalArea,
    description,
    numberOfFloors,
    // constructionYear,
    writtenAddress,
  });
  if (!building) {
    return next(createHttpError(400, "Building not found"));
  }
  return res
    .status(200)
    .json({ success: true, message: "Building updated successfully" });
});

// delete building
export const deleteBuilding = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const building = await Building.findByIdAndDelete(id);
  if (!building) {
    return next(createHttpError(400, "Building not found"));
  }
  return res
    .status(200)
    .json({ success: true, message: "Building deleted successfully" });
});



