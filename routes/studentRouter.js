import express from "express";
import Student from "../models/student.js";
import { getStudents , createStudents, deleteStudent} from "../controllers/studentController.js";

// create studentRouter
const studentRouter = express.Router();

studentRouter.get("/",getStudents)

studentRouter.post("/",createStudents)

studentRouter.delete("/",deleteStudent)
export default studentRouter