import expess, { Router } from "express";
import { getYourGrades } from "../controllers/studentController.js";

const router: Router = expess.Router();

router.route("/my-grades").get(getYourGrades);

export default router;