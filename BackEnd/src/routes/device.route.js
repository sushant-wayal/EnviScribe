import { Router } from "express";
import {
    getAllDevices,
    getDevice,
    createDevice,
    deleteDevice
} from "../controllers/device.controllers.js";

const router = Router();

router.route("/")
.get(getAllDevices)
.post(createDevice);

router.route("/:id")
.get(getDevice)
.delete(deleteDevice);

export default router;