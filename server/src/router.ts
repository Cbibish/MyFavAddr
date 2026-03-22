import { Router } from "express";
import usersRouter from "./controllers/Users";
import addressesRouter from "./controllers/Addresses";
import searchRouter from "./controllers/searchRouter";

const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/addresses", addressesRouter);
apiRouter.use("/search", searchRouter);

export default apiRouter;
