import createHttpError from "http-errors";
import { TryCatch } from "../../utils/tryCatch.js";
import { Building } from "../../models/buildingModel/building.model.js";
import { Request } from "express";
import { BuildingSchemaTypes } from "../../types/buildingTypes.js";

// add building
export const addBuilding = TryCatch(
  async (req: Request<{}, {}, BuildingSchemaTypes>, res, next) => {

    const usreId = req.user?._id;
    // get all body data
    const {
      name,
      address,
      mobile,
      email,
      totalArea,
      description,
      numberOfFloors,
      constructionYear,
      totalFloors,
      writtenAddress
    } = req.body;

    // validate all fields
    if (
      !name ||
      !address ||
      !mobile ||
      !email ||
      !totalArea ||
      !description ||
      !numberOfFloors ||
      !constructionYear ||
      !totalFloors ||
      !writtenAddress
    ) {
      return next(createHttpError(400, "All fields are required"));
    }

    // create building
    const building = await Building.create({
      name,
      address,
      ownerId: usreId,
      mobile,
      email,
      totalArea,
      description,
      numberOfFloors,
      constructionYear,
      totalFloors,
      writtenAddress
    });

    // success response
    if (building) {
      return res
        .status(201)
        .json({ success: true, message: "Building created successfully" });
    }
  }
);

// get all buildings
export const getAllBuildings = TryCatch(async (req, res, next) => {

const usreId = req.user?._id;

const building = await Building.find({ownerId: usreId});

  if (building.length < 1) {
    return res.status(400).json({ message: "Opps empty building" });
  }

  return res.status(200).json(building);
});

// get single building
export const getSingleBuilding = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const building = await Building.findById(id);

  if (!building) {
    return res.status(400).json({ message: "Building not found" });
  }

  return res.status(200).json(building);
});

// update building
export const updateBuilding = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    address,
    owner,
    mobile,
    email,
    totalArea,
    description,
    numberOfFloors,
    constructionYear,
    totalFloors,
    writtenAddress
  } = req.body;
  if (
    !name ||
    !address ||
    !owner ||
    !mobile ||
    !email ||
    !totalArea ||
    !description ||
    !numberOfFloors ||
    !constructionYear ||
    !totalFloors ||
    !writtenAddress
  ) {
    return next(createHttpError(400, "All fields are required"));
  }
  const building = await Building.findByIdAndUpdate(id, {
    name,
    address,
    owner,
    mobile,
    email,
    totalArea,
    description,
    numberOfFloors,
    constructionYear,
    totalFloors,
    writtenAddress
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