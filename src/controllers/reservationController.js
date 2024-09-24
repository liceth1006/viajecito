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

//Funcion para agregar reserva
export const postReservation = async (req, res) => {
  try {
    const { user_id, property_id, check_in_date, check_out_date, total_price } = req.body;
    const newReservation = { user_id, property_id, check_in_date, check_out_date, total_price};

    await pool.query("INSERT INTO reservation (user_id, property_id, check_in_date, check_out_date, total_price) VALUES (?, ?, ?, ?, ?)",[user_id, property_id, check_in_date, check_out_date, total_price]);

    res.status(200).json({ message: '¡Reservacion agregada con éxito!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//funcion para eliminar reserva
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM reservation WHERE id = ?", [id]);
    
    res.status(200).json({ message: '¡Reserva eliminada con éxito!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};