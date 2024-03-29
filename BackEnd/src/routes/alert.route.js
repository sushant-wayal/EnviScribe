import { Router } from "express";
import {
    getAllAlerts,
    getAlert
} from "../controllers/alert.controllers.js";

const router = Router();

router.route("/:sensorId")
    .get(getAllAlerts);

router.route("/:id")
    .get(getAlert)

export default router;