import { Router } from "express";
import { countOccurrences } from "../utils/countOccurrences";

const searchRouter = Router();

searchRouter.post("/", (req, res) => {
  const { text, word } = req.body;

  if (!text || !word) {
    return res.status(400).json({ message: "text and word are required" });
  }

  const count = countOccurrences(text, word);
  return res.json({ count });
});

export default searchRouter;
