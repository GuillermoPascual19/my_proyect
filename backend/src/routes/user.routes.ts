import { Router } from "express";
import {
  recoverPassword,
  registerUser,
  activateAccount,
  loginUser,
  changePassword,
  getSubjectsByStudent,
  getStudents,
  closeSession,
  uploadImages,
  changeCrendentials,
  assignSubject,
  unassignSubject,
  getNumStudentsPerSubject,
  loginGoogle,
} from "../controllers/user.controller";

import { verifyToken, upload } from "../middleware/logger.middleware";
import passport from "passport";
import authRouter from "./auth";

const router = Router();

// Rutas de autenticación (auth.ts)
router.use("/auth", authRouter); // Usamos las rutas del auth.ts

// Rutas para usuarios
router.get("/teachers", getStudents);
router.post("/students", getSubjectsByStudent);
router.post("/recover-password", recoverPassword);
router.post("/register", registerUser);
router.post("/activate-account", activateAccount);
router.post("/signin", loginUser);
router.post("/loginGoogle", loginGoogle);
router.post("/change-password", changePassword);
router.post("/upload-image", [upload.single("file")], uploadImages);
router.post("/closeSession", [verifyToken], closeSession);
router.post("/changeCredentials", [verifyToken], changeCrendentials);
router.post("/assign-subject", assignSubject);
router.post("/unassign-subject", unassignSubject);
router.post("/num-stud-subject", getNumStudentsPerSubject);
// Ruta para Google Sign-In
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Ruta de callback para manejar la respuesta de Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    if (!req.user) {
      return res.status(404).send("Authentication failed");
    }

    const data = (req.user as any).get({ plain: true });
    const userRole = data.role;
    const accessToken = data.access_token;
    console.log("-------------------\n\n\nUser.Routes user:", data);
    console.log("\n\n\n-------------------");

    //Crear una variable de entorno para la url, de tal manera que pueda acceder a http:localhost:8080
    //Si no especifico http:localhost:8080, me redirige a asi mismo, es decir, "busca entre los endpoints"
    if (userRole === 1) {
      res.redirect(`http://localhost:8080/student?token=${accessToken}&typelogin=google`);
    } else if (userRole === 2) {
      res.redirect(`http://localhost:8080/teacher?token=${accessToken}&typelogin=google`);
    } else {
      res.redirect(`http://localhost:8080/login`);
    }
  }
);

export default router;
