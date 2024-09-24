import pool from "../database/database.js";

//Funcipon obtener favoritos
export const getFavorite = async (req, res) => {
  const userId = req.use_id;

  try {
    if (!userId) {
      return res.status(400).json({ error: "El user_id es requerido" });
    }

    const [favorites] = await pool.query("SELECT * FROM favorites WHERE use_id = ?", [userId]);

    if (favorites.length === 0) {
      return res.status(404).json({ error: "No se encontraron favoritos 😰" });
    }

    res.json(favorites); 
  } catch (error) {
    console.error("Error al obtener los favoritos", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

//Funcion guardar favorito
export const postFavorite = async (req, res) => {
  try {
    const { use_id, hotel_id, hotel_name_trans, review_score_word, review_score, max_photo_url,city,address, amount_unrounded } = req.body;

    const [existingFavorite] = await pool.query(
      "SELECT * FROM favorites WHERE use_id = ? AND hotel_id = ?", 
      [use_id, hotel_id]
    );

    if (existingFavorite.length > 0) {
      return res.status(400).json({ message: '¡Este hotel ya está en tus favoritos!.' });
    }


    const newFavorite = {
      use_id,
      hotel_id,
      hotel_name_trans,
      review_score_word,
      review_score,
      max_photo_url,
      city,
      address,
      amount_unrounded
    };

    await pool.query("INSERT INTO favorites SET ?", [newFavorite]);

    res.status(200).json({ message: '¡Favorito agregado con éxito!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Ruta para verificar si un hotel está en favoritos y marcar el corazon
export const checkFavorite = async (req, res) => {
  try {
    const { use_id, hotel_id } = req.body;

    // Comprobar si el favorito existe
    const [existingFavorite] = await pool.query(
      "SELECT * FROM favorites WHERE use_id = ? AND hotel_id = ?", 
      [use_id, hotel_id]
    );

    if (existingFavorite.length > 0) {
      return res.status(200).json({ isFavorite: true });
    }

    res.status(200).json({ isFavorite: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//funcion para eliminar favorito
export const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const [existingFavorite] = await pool.query(
      "SELECT * FROM favorites WHERE favorites_id = ?", 
      [id]
    );

    if (existingFavorite.length === 0) {
      return res.status(404).json({ message: '¡Favorito no encontrado!.' });
    }

    await pool.query("DELETE FROM favorites WHERE favorites_id = ?", [id]);
    
    res.status(200).json({ message: '¡Favorito eliminado con éxito!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
