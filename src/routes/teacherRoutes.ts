import expess, { Router } from "express";
import { addGradeForStudent, editGradeForStudent, getAverageOfGradesOfStudents, getGradeOfStudent, getGradesOfAllStudents } from "../controllers/teacherController.js";
import { teacherGeneralMiddleware, teacherMiddlewareForSpecificStudent } from "../middlewares/teacherMiddleware.js";

const router: Router = expess.Router();


router.route("/grades").get(teacherGeneralMiddleware, getGradesOfAllStudents);

router.route("/grades/average").get(getAverageOfGradesOfStudents);

router.use(teacherMiddlewareForSpecificStudent);

router.route("/grades/:id")
.get(getGradeOfStudent)
.post(addGradeForStudent);

router.route("/grades/:id/:gradeId").put(editGradeForStudent);

export default router;