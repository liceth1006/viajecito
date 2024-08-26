import pool from "../database/database.js";

export const getFavorite = async (req,res)=>{
  const userId = req.use_id;

  try {
    if (!userId) {
      return res.status(400).json({ error: "el use_id es requerido" });
    }

   // Buscar los favoritos por ID de usuario
   const [favorites] = await pool.query("SELECT * FROM favorites WHERE use_id = ?", [userId]);


   // Verifica si se encontraron favoritos
   if (favorites.length === 0) {
    return res.status(404).json({ error: "No se encontraron favoritos 😰" });
  }

  // Devuelve la lista de favoritos
  return res.json(favorites);

  } catch (error) {
    console.error("Error al obtener los favoritos", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
}

export const postFavorite = async (req,res)=>{
  try{
    const  property_id  = req.params.hotel_id;
    const userId = req.use_id;

    if (!property_id) {
      return res.status(400).json({ error: "El ID de la propiedad es requerido" });
    }

    if (!userId) {
      return res.status(400).json({ error: "El ID de usuario es requerido" });
    }

    const newFavorite = {
      use_id : userId,
      property_id:property_id
    };
   // Verificar si el favorito ya existe para evitar duplicados
   const [existingFavorites] = await pool.query("SELECT * FROM favorites WHERE use_id = ? AND property_id = ?", [userId, property_id]);

   if (existingFavorites.length > 0) {
     return res.status(400).json({ error: "Este favorito ya existe" });
   }

   // Insertar el nuevo favorito
   await pool.query("INSERT INTO favorites SET ?", [newFavorite]);

   // Redirigir al usuario 
   res.status(201).json({ message: "Favorito agregado exitosamente" });
    res.redirect("/favoritePrivate");
  }catch(error){

  }
}