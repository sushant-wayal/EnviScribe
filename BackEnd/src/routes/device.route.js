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
    .post(isLoggedIn, createDevice);

router.route("/add")
    .post(isLoggedIn, createDevice);

router.route("/create")
    .post(createDevice);

router.route("/:id")
    .get(isLoggedIn, getDevice)
    .delete(isLoggedIn, deleteDevice);

export default router;