import { Router } from "express";
import {
    generateRandomLogs,
    getAllLogs,
    getLog,
    testRoute,
    createLog,
} from "../controllers/log.controllers.js";
import { isLoggedIn } from "../middlewares/authentication.middleware.js";

const router = Router();

router.route("/:sensorId")
    .get(isLoggedIn, getAllLogs);

router.route("/:id")
    .get(isLoggedIn, getLog)

router.route("/generateData")
    .get(isLoggedIn, generateRandomLogs);

router.route("/testRoute")
    .post(testRoute)

router.route("/create")
    .get(createLog)

export default router;