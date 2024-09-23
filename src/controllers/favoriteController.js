import pool from "../database/database.js";

export const getFavorite = async (req, res) => {
  const userId = req.use_id;

  console.log('User ID:', userId);

  try {
    if (!userId) {
      return res.status(400).json({ error: "El use_id es requerido" });
    }

    // Buscar los favoritos por ID de usuario
    const [favorites] = await pool.query("SELECT * FROM favorites WHERE use_id = ?", [userId]);

    // Verifica si se encontraron favoritos
    if (favorites.length === 0) {
      return res.status(404).json({ error: "No se encontraron favoritos 😰" });
    }

    // Renderiza la vista con los datos de los favoritos
    res.render("private/favorite", { favorito: favorites });

  } catch (error) {
    console.error("Error al obtener los favoritos", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};



export const postFavorite = async (req, res) => {
  try {
    const { use_id, hotel_id, hotel_name_trans, review_score_word, review_score, max_photo_url, amount_unrounded } = req.body;

    // Comprobar si el favorito ya existe
    const [existingFavorite] = await pool.query(
      "SELECT * FROM favorites WHERE use_id = ? AND hotel_id = ?", 
      [use_id, hotel_id]
    );

    if (existingFavorite.length > 0) {
      return res.status(400).json({ message: 'This hotel is already in your favorites.' });
    }


    const newFavorite = {
      use_id,
      hotel_id,
      hotel_name_trans,
      review_score_word,
      review_score,
      max_photo_url,
      amount_unrounded
    };

    await pool.query("INSERT INTO favorites SET ?", [newFavorite]);

    res.status(200).json({ message: 'Favorite added successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Ruta para verificar si un hotel está en favoritos
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
