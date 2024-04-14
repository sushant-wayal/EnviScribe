import { Router } from "express";
import {
  registerInstitution
} from "../controllers/institution.controllers.js";

const router = Router();

router.route("/register").post(registerInstitution);

export default router;