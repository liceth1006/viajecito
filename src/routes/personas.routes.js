import { Router } from "express";
import pool from "../database/database.js";
const router = Router();



router.post("/add", async (req, res) => {
  try {
    const { name, lastname, age, tipo_persona_id } = req.body;
    const newPersona = {
      name,
      lastname,
      age,
      tipo_persona_id,
    };
    await pool.query("INSERT INTO personas SET?", [newPersona]);
    res.redirect("/list");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/list", async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT personas.id,personas.tipo_persona_id,personas.name,personas.lastname,personas.age, tipo_persona.tipo FROM personas inner join tipo_persona ON tipo_persona.id =personas.tipo_persona_id");
    res.render("personas/list", { personas: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
   
  }
});

// Ruta para obtener los datos de la persona a editar
router.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [personas] = await pool.query("SELECT * FROM personas WHERE id = ?", [id]);
    const personaEdit = personas[0];
    const [tiposPersona] = await pool.query("SELECT * FROM tipo_persona");

    res.render("personas/edit", { persona: personaEdit, tipo_persona: tiposPersona });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para actualizar los datos de la persona
router.post("/edit/:id", async (req, res) => {
  try {
    const { name, lastname, age,tipo_persona_id } = req.body;
    const { id } = req.params;
    const editPersona = { name, lastname, age ,tipo_persona_id};
    await pool.query("UPDATE personas SET ? WHERE id = ?", [editPersona, id]);
    res.redirect("/list");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM personas WHERE id = ?", [id]);
    res.redirect("/list");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




export default router;
