import createHttpError from "http-errors";
import { TryCatch } from "../../utils/tryCatch.js";
import { Building } from "../../models/buildingModel/building.model.js";
import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
// import { BuildingFloor } from "../../models/buildingModel/buildingFloor.model.js";
import fs from "fs";
import path from "path";
import { BuildingFloor } from "../../models/buildingModel/buildingFloor.model.js";

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

// Define the SearchCriteria and SearchQuery interfaces
interface SearchCriteria {
  buildingName?: { $regex: string; $options: string };
  totalArea?: { $gte: number; $lte: number };
}

interface SearchQuery {
  query?: string;
  range?: string;
}

// Upload a file to Cloudinary
const uploadToCloudinary = async (file: MulterFile) => {
  try {
    const filePath = path.resolve(file.path);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "buildings",
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload image to Cloudinary: ${error}`);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

// Add a new building
export const addBuilding = TryCatch(
  async (req, res: Response, next: NextFunction) => {
    const files = req.files as unknown as MulterFiles;

    let imageUrls: string[] = [];

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

    // Parse the building details from the request body
    const buildingDetails = JSON.parse(req.body.buildingDetails);

    // Save building details along with image URLs to the database
    const newBuilding = new Building({ ...buildingDetails, images: imageUrls });

    await newBuilding.save(); // Save the building document to the database

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Building created successfully",
      building: newBuilding,
    });
  }
);

export const searchBuildings = async (
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response
) => {
  const { query, range } = req.query;

  // Log the incoming query parameters for debugging
  console.log("Query parameters:", { query, range });

  try {
    // Parse the range if provided
    let rangeFilter: any = {};
    if (range) {
      const [min, max] = range.split("-").map(Number); // Adjust split based on range format
      console.log("Parsed range:", { min, max });
      if (!isNaN(min) && !isNaN(max)) {
        rangeFilter = {
          $expr: {
            $and: [
              { $gte: ["$buildingInfo.totalArea", min] },
              { $lte: ["$buildingInfo.totalArea", max] },
            ],
          },
        };
      }
    }

    // Build the aggregation pipeline
    const pipeline: any[] = [
      {
        $lookup: {
          from: "buildings", // The name of the collection you are joining with
          localField: "buildingId", // The field in `BuildingFloor`
          foreignField: "_id", // The field in `Building`
          as: "buildingInfo", // The name of the array field to add in the output documents
        },
      },
      {
        $unwind: {
          path: "$buildingInfo",
          preserveNullAndEmptyArrays: true, // If you want to include floors without a corresponding building
        },
      },
      {
        $match: {
          ...(query
            ? { "buildingInfo.buildingName": { $regex: query, $options: "i" } }
            : {}),
          ...rangeFilter,
        },
      },
    ];

    const buildings = await BuildingFloor.aggregate(pipeline);

    // console.log('Buildings:', buildings);

    if (buildings.length === 0) {
      return res.status(404).json({ message: "No buildings found" });
    }

    return res.status(200).json(buildings);
  } catch (error) {
    console.error(`Failed to search buildings: ${error}`);
    return res.status(500).json({ message: "Failed to search buildings" });
  }
};

// Get all buildings
export const getAllBuildings = TryCatch(async (req, res, next) => {
  const userId = req.user?._id;

  const buildings = await BuildingFloor.find({ userId }).populate("buildingId");

  return res.status(200).json(buildings);
});

// Get all buildings by user
export const getAllBuildingsByUser = TryCatch(async (req, res, next) => {
  const userId = req.user?._id;

  const buildings = await Building.find({ ownerId: userId });

  if (buildings.length < 1) {
    return res.status(400).json({ message: "Oops, no buildings found" });
  }

  return res.status(200).json(buildings);
});

// Get a single building
export const getSingleBuilding = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const building = await Building.findOne({ _id: id });

  return res.status(200).json(building);
});

// Update a building
export const updateBuilding = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const building = await Building.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!building) {
    return next(createHttpError(400, "Building not found"));
  }

  // Save building
  await building.save();

  return res
    .status(200)
    .json({ success: true, message: "Building updated successfully" });
});

// Delete a building
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

// Add building location
export const addBuildingLocation = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const { longitude, latitude } = req.body;

  const building = await Building.findByIdAndUpdate(
    id,
    { longitude, latitude },
    { new: true, runValidators: true }
  );

  if (!building) {
    return next(createHttpError(400, "Building not found"));
  }

  // Save building
  await building.save();

  return res
    .status(200)
    .json({ success: true, message: "Building updated successfully" });
});

// Add sensors to a building
export const addBuildingSensors = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { sensors } = req.body;

  const building = await Building.findByIdAndUpdate(
    id,
    { sensors },
    { new: true, runValidators: true }
  );

  if (!building) {
    return next(createHttpError(400, "Building not found"));
  }

  // Save building
  await building.save();

  return res
    .status(200)
    .json({ success: true, message: "Building updated successfully" });
});

// Get building sensors
export const getBuildingSensors = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const building = await BuildingFloor.find({ buildingId: id });
  if (!building) {
    return next(createHttpError(400, "Building not found"));
  }

  return res.status(200).json(building);
});

// Add a new building floor
export const addBuildingFloor = TryCatch(async (req, res, next) => {
  try {
    const { floor, rooms, buildingId, sensors, area, floorType, unitOfArea } =
      req.body;

    let parsedSensors;
    try {
      parsedSensors = JSON.parse(sensors).map((sensor: string) =>
        JSON.parse(sensor)
      ); // Parse the JSON string to an object
    } catch (error) {
      console.error("Error parsing sensors:", error);
      return res
        .status(400)
        .json({ success: false, message: "Invalid sensors format." });
    }

    // Handle file uploads
    const files = req.files as unknown as MulterFiles;
    let imageUrls: string[] = [];
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

    // Create a new BuildingFloor instance and save it to the database
    const newBuildingFloor = new BuildingFloor({
      floor,
      rooms,
      buildingId,
      sensors: parsedSensors,
      area,
      floorType,
      unitOfArea,
      images: imageUrls,
    });

    await newBuildingFloor.save();

    return res.status(201).json({
      success: true,
      message: "Building floor created successfully",
      buildingFloor: newBuildingFloor,
    });
  } catch (error) {
    console.error(`Failed to add building floor: ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add building floor" });
  }
});


// get all building floors
export const getAllBuildingFloors = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  console.log("id", id)

  const buildingFloors = await BuildingFloor.find({ buildingId: id });

  return res.status(200).json(buildingFloors);
});