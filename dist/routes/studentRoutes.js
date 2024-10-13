import expess from "express";
import { getYourGrades } from "../controllers/studentController.js";
const router = expess.Router();
router.route("/my-grades").get(getYourGrades);
export default router;
