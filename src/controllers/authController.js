import { generateToken } from "../utils/tokenManager.js";
import { hashPassword } from "../utils/hashPassword.js";
import pool from "../database/database.js";
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  try {
    const { use_mail, use_password } = req.body;

    if (!use_mail || !use_password) {
      return res.status(400).json({ error: "Correo electrónico y contraseña son requeridos" });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT use_id, use_password FROM users WHERE use_mail = ?',
      [use_mail]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(403).json({ error: "No existe este usuario", use_mail });
    }

    const user = rows[0];

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(use_password, user.use_password);
    if (!isMatch) {
      return res.status(403).json({ error: "Contraseña incorrecta" });
    }

    // Generar tokens
    const { token, } = generateToken(user.use_id);
    return res.json({ token, userId: user.use_id});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};


export const registerUser = async (req, res) => {
  try {
    const { use_mail, use_password, use_name, use_lastname, use_birthdate } = req.body;
    
    // Validación de entrada
    if (!use_mail || !use_password || !use_name || !use_lastname || !use_birthdate) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.query("SELECT * FROM users WHERE use_mail = ?", [use_mail]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Ya existe un usuario con este correo electrónico" });
    }

    // Cifrar la contraseña antes de guardarla
    const hashedPassword = await hashPassword(use_password);

    // Crear un nuevo usuario
    const newUser = {
      use_mail,
      use_password: hashedPassword, // Usar la contraseña cifrada
      use_name,
      use_lastname,
      use_birthdate
    };

    // Guardar el usuario en la base de datos
    const [result] = await pool.query(
      "INSERT INTO users (use_mail, use_password, use_name, use_lastname, use_birthdate) VALUES (?, ?, ?, ?, ?)",
      [newUser.use_mail, newUser.use_password, newUser.use_name, newUser.use_lastname, newUser.use_birthdate]
    );

    // Obtener el ID del nuevo usuario
    const userId = result.insertId;

    // Generar los tokens JWT
    const { token } = generateToken(userId);
  
    // Enviar la respuesta con los tokens
    return res.status(201).json({ token, userId, message: "Usuario registrado con éxito" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

export const logout = async (req,res)=>{
  res.clearCookie("refreshToken");
  res.json({ ok: true });
}

export const profile = async (req, res) => {

  const userId = req.use_id;

  try {
    if (!userId) {
      return res.status(400).json({ error: "el use_id es requerido" });
    }

    // Buscar el usuario por ID
    const [existingUsers] = await pool.query("SELECT * FROM users WHERE use_id = ?", [userId]);

    // Verifica si se encontró algún usuario
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado 😰" });
    }

    // Accede al primer usuario del resultado
    const user = existingUsers[0];

    // Devuelve la información del usuario encontrado
    return res.json({
      use_mail: user.use_mail,
      use_name: user.use_name, 
      use_lastname: user.use_lastname,
      use_birthdate: user.use_birthdate
    });

  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
}
