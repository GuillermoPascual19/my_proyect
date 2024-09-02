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
  uploadImage,
  deleteUser,
  changeCrendentials,
} from "../controllers/user.controller";

import { verifyToken } from "../middleware/logger.middleware";

const router = Router();

// Rutas para usuarios
router.post("/users", getAllUsers);
router.post("/students", getStudents);
router.post("/subjects", getSubjectsByStudent);
router.post("/recover-password", recoverPassword);
router.post("/register", registerUser);
router.post("/activate-account", activateAccount);
router.post("/signin", loginUser);
router.post("/change-password", changePassword);
router.delete("/users/:id", deleteUser);
router.post("/upload-image", uploadImage);
router.post("/closesession", [verifyToken], closeSession);
router.post("/changeCredentials", [verifyToken], changeCrendentials);
//router.post('/upload-image', uploadImage);

export default router;
