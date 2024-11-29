import express from "express";
import { addRoleToUser, getUserRoles } from "../controllers/AuthorityControlers";
import { authenticateUser, authorizeRoles } from "../middlewares/authenticateUser";

const router = express.Router();

// Kullanıcıya rol ekleme (Sadece admin)
router.post("/add-role", authenticateUser,authorizeRoles([ "admin"]),addRoleToUser);

// Kullanıcı rollerini görüntüleme
router.get("/roles/:userId",authenticateUser, authorizeRoles([ "admin"]),getUserRoles);

export default router;
