import { Router } from "express";
import {
    getAllDevices,
    getDevice,
    createDevice,
    deleteDevice
} from "../controllers/device.controllers.js";
import { isLoggedIn } from "../middlewares/authentication.middleware.js";

const router = Router();

router.route("/")
    .get(isLoggedIn, getAllDevices)
    .post(createDevice);

router.route("/create")
    .post(isLoggedIn, createDevice);

router.route("/:id")
    .get(getDevice)
    .delete(deleteDevice);

export default router;