import pool from "../database/database.js";

//Funcion obtener reservas
export const getReservation = async (req, resizeBy) => {
    const userID = req.user_id;

    try {
        if (!userID) {
            return res.status(400).json({ error: "El user_id es requerido" });
        }

        const [reservations] = await pool.query("SELECT * FROM reservation WHERE user_id = ?", [userID]);

        if (reservations.length === 0) {
            return res.status(404).json({ error: "No se encontraron reservas 😰" });
        }

        res.json(favorites);
        
    } catch (error) {
        console.error("Error al obtener las reservas", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
};