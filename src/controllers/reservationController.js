import pool from "../database/database.js";

//Funcion obtener reservas
export const getReservation = async (req, res) => {
  const userID = req.use_id;

  try {
    if (!userID) {
      return res.status(400).json({ error: "El user_id es requerido" });
    }

    const [reservations] = await pool.query("SELECT * FROM reservation WHERE user_id = ?", [userID]);

    if (reservations.length === 0) {
      return res.status(404).json({ error: "No se encontraron reservas 😰" });
    }

    res.json(reservations);
  } catch (error) {
    console.error("Error al obtener las reservas", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

//Funcion para agregar reserva
export const postReservation = async (req, res) => {
  try {
    const { user_id, property_id, check_in_date, check_out_date, total_price } = req.body;
    
   
    if (!user_id || !property_id || !check_in_date || !check_out_date || !total_price) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const newReservation = { 
      user_id, 
      property_id, 
      check_in_date, 
      check_out_date, 
      total_price
    };

    // Guardar el usuario en la base de datos
    const [result] = await pool.query(
      "INSERT INTO reservation (user_id, property_id, check_in_date, check_out_date, total_price) VALUES (?, ?, ?, ?, ((DATEDIFF(check_out_date, check_in_date))*?))",
      [newReservation.user_id, newReservation.property_id, newReservation.check_in_date, newReservation.check_out_date, newReservation.total_price]
    );

    // Enviar la respuesta con los tokens
    return res.status(200).json({ message: '¡Reservacion agregada con éxito!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
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