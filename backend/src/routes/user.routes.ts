import { Router } from "express";
import {
  getAllUsers,
  recoverPassword,
  registerUser,
  activateAccount,
  loginUser,
  changePassword,
  getSubjectsByStudent,
  getStudents,
  closeSession,
  uploadImages,
  deleteUser,
  changeCrendentials,
  assignSubject,
  unassignSubject,
  getNumStudentsPerSubject,
} from "../controllers/user.controller";

import { verifyToken, upload } from "../middleware/logger.middleware";

const router = Router();

// Rutas para usuarios
router.post("/users", getAllUsers);
router.post("/teachers", getStudents);
router.post("/students", getSubjectsByStudent);
router.post("/recover-password", recoverPassword);
router.post("/register", registerUser);
router.post("/activate-account", activateAccount);
router.post("/signin", loginUser);
router.post("/change-password", changePassword);
router.delete("/users/:id", deleteUser);
router.post("/upload-image", [upload.single('file')], uploadImages);
router.post("/closesession", [verifyToken], closeSession);
router.post("/changeCredentials", [verifyToken], changeCrendentials);
router.post("/assign-subject", assignSubject);
router.post("/unassign-subject", unassignSubject);
router.post("/num-stud-subject", getNumStudentsPerSubject);
//router.post('/upload-image', uploadImage);

export default router;
