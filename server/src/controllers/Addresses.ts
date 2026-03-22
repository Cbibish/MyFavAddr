import { Router } from "express";
import { getCoordinatesFromSearch } from "../utils/getCoordinatesFromSearch";
import { Address } from "../entities/Address";
import { isAuthorized } from "../utils/isAuthorized";
import { getUserFromRequest } from "../utils/getUserFromRequest";
import { getDistance } from "../utils/getDistance";
import { validateRating } from "../utils/validateRating";
import { validateVisibility } from "../utils/validateVisibility";

const addressesRouter = Router();

addressesRouter.post("/", isAuthorized, async (req, res) => {
  const searchWord = req.body.searchWord;
  const name = req.body.name;
  const description = req.body.description;
  if (!searchWord || !name) {
    return res.status(400).json({ message: "name and search word are required" });
  }
  const coordinates = await getCoordinatesFromSearch(searchWord);
  if (coordinates) {
    const user = await getUserFromRequest(req);
    const address = new Address();
    address.name = name;
    address.description = description;
    address.isPublic = false;
    Object.assign(address, coordinates);
    address.user = user;
    await address.save();
    return res.json({ item: address });
  } else {
    return res.status(404).json({ message: "search word not found" });
  }
});

addressesRouter.get("/", isAuthorized, async (req, res) => {
  const user = await getUserFromRequest(req);
  const addresses = await Address.findBy({ user: { id: user.id } });
  return res.json({ items: addresses });
});

addressesRouter.get("/public", isAuthorized, async (req, res) => {
  const addresses = await Address.findBy({ isPublic: true });
  return res.json({ items: addresses });
});

addressesRouter.post("/searches", isAuthorized, async (req, res) => {
  const radius = req.body.radius;
  if (!radius || typeof radius !== "number" || radius < 0) {
    return res.status(400).json({ message: "radius is required, must be a positive number" });
  }
  const from = req.body.from;
  if (!from || !from.lng || !from.lat || typeof from.lng !== "number" || typeof from.lat !== "number") {
    return res.status(400).json({ message: "from object must contain lat and lng props, both numbers" });
  }
  const user = await getUserFromRequest(req);
  const addresses = await Address.findBy({ user: { id: user.id } });
  const closeAddresses = [];
  for (const address of addresses) {
    if (getDistance(address, from) <= radius) {
      closeAddresses.push(address);
    }
  }
  return res.json({ items: closeAddresses });
});

addressesRouter.patch("/:id/rating", isAuthorized, async (req, res) => {
  const user = await getUserFromRequest(req);
  const address = await Address.findOne({
    where: { id: Number(req.params.id) },
    relations: ["user"],
  });
  if (!address) {
    return res.status(404).json({ message: "address not found" });
  }
  if (address.user.id !== user.id) {
    return res.status(403).json({ message: "forbidden" });
  }
  const { rating } = req.body;
  if (!validateRating(rating)) {
    return res.status(400).json({ message: "rating must be an integer between 1 and 5" });
  }
  address.rating = rating;
  await address.save();
  return res.json({ item: address });
});

addressesRouter.patch("/:id/visibility", isAuthorized, async (req, res) => {
  const user = await getUserFromRequest(req);
  const address = await Address.findOne({
    where: { id: Number(req.params.id) },
    relations: ["user"],
  });
  if (!address) {
    return res.status(404).json({ message: "address not found" });
  }
  if (address.user.id !== user.id) {
    return res.status(403).json({ message: "forbidden" });
  }
  const { isPublic } = req.body;
  if (!validateVisibility(isPublic)) {
    return res.status(400).json({ message: "isPublic must be a boolean" });
  }
  address.isPublic = isPublic;
  await address.save();
  return res.json({ item: address });
});

export default addressesRouter;
