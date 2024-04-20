import { Router } from "express";
import {
    getAllSensors,
    getSensor,
    createSensor,
    updateSensor,
    deleteSensor
} from "../controllers/sensor.controllers.js";
import { isLoggedIn } from "../middlewares/authentication.middleware.js";

const router = Router();

router.route("/")
    .get(isLoggedIn ,getAllSensors)

router.route("/:deviceId")
    .get(isLoggedIn, getAllSensors)
    .post(isLoggedIn, createSensor);

router.route("/:id")
    .get(isLoggedIn, getSensor)
    .put(isLoggedIn, updateSensor)
    .delete(isLoggedIn, deleteSensor);

export default router;