import expess, { Router } from "express";
import { addGradeForStudent, editGradeForStudent, getAverageOfGradesOfStudents, getGradeOfStudent, getGradesOfAllStudents } from "../controllers/teacherController.js";
import { teacherGeneralMiddleware, teacherMiddlewareForSpecificStudent } from "../middlewares/teacherMiddleware.js";

const router: Router = expess.Router();


router.route("/grades").get(teacherGeneralMiddleware, getGradesOfAllStudents);

router.route("/grades/average").get(teacherGeneralMiddleware, getAverageOfGradesOfStudents);

router.route("/grades/:id")
.get(teacherMiddlewareForSpecificStudent, getGradeOfStudent)
.post(teacherMiddlewareForSpecificStudent, addGradeForStudent);

router.route("/grades/:id/:gradeId").put(teacherMiddlewareForSpecificStudent, editGradeForStudent);

export default router;