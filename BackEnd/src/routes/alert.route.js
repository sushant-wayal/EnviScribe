import { Router } from "express";
import {
    getAllAlerts,
    getAlert
} from "../controllers/alert.controllers.js";
import { isLoggedIn } from "../middlewares/authentication.middleware.js";

const router = Router();

router.route("/:sensorId")
    .get(isLoggedIn, getAllAlerts);

router.route("/:id")
    .get(isLoggedIn, getAlert)

export default router;