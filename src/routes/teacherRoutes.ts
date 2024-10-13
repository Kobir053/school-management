import expess, { Router } from "express";
import { addGradeForStudent, getGradesOfAllStudents } from "../controllers/teacherController.js";
import { teacherGeneralMiddleware, teacherMiddlewareForSpecificStudent } from "../middlewares/teacherMiddleware.js";

const router: Router = expess.Router();


router.route("/grades").get(teacherGeneralMiddleware, getGradesOfAllStudents);

// router.route("/grades/average").get();

router.use(teacherMiddlewareForSpecificStudent);

router.route("/grades/:id")
// .get()
.post(addGradeForStudent)
// .put();

export default router;