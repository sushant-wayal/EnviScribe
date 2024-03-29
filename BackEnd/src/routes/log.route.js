import { Router } from "express";
import {
    getAllLogs,
    getLog,
} from "../controllers/log.controllers.js";

const router = Router();

router.route("/:sensorId")
    .get(getAllLogs);

router.route("/:id")
    .get(getLog)

export default router;