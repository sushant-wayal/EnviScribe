import { Router } from "express";
import {
    getAllLogs,
    getLog,
    createLog,
} from "../controllers/log.controllers.js";
import { isLoggedIn } from "../middlewares/authentication.middleware.js";

const router = Router();

router.route("/:sensorId")
    .get(isLoggedIn, getAllLogs);

router.route("/:id")
    .get(isLoggedIn, getLog);

router.route("/create")
    .post(createLog)

export default router;