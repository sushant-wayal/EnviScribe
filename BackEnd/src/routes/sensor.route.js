import { Router } from "express";
import {
    getAllSensors,
    getSensor,
    createSensor,
    updateSensor,
    deleteSensor
} from "../controllers/sensor.controllers.js";

const router = Router();

router.route("/:deviceId")
    .get(getAllSensors)
    .post(createSensor);

router.route("/:id")
    .get(getSensor)
    .put(updateSensor)
    .delete(deleteSensor);

export default router;