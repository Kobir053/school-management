import expess, { Router } from "express";
import { login, registerForStudent, registerForTeacher } from "../controllers/authController.js";

const router: Router = expess.Router();

router.route("/register-for-teacher").post(registerForTeacher);

router.route("/register-for-student").post(registerForStudent);

router.route("/login").post(login);