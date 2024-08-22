import { Router } from "express";
import pool from "../database/database.js";
const router = Router();

// Renderizar el formulario de agregar persona con los tipos de persona disponibles
router.get("/add", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM tipo_persona");
    res.render("personas/add", { tipo_persona: result });
  } catch (err) {
    console.log("Error al conectar con la base de datos:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;

