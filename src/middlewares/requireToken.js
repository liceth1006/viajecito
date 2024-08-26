import jwt from 'jsonwebtoken';
import 'dotenv/config'; // Asegúrate de que las variables de entorno estén cargadas
import { tokenVerificationErrors } from '../utils/tokenManager.js';

export const requireToken = (req, res, next) => {
  try {
    // Obtener el token del encabezado de autorización
    let token = req.headers?.authorization;
console.log("verificacion",token)
    if (!token) {
      // Si no se proporciona el token, lanzar un error
      throw new Error('No Bearer');
    }

    // Extraer el token del encabezado Authorization
    token = token.split(' ')[1];

    // Verificar el token
    const decoded = jwt.verify(token, 'SflKxwRJSMeKKF2QT4fwpa'); // Usa la clave secreta desde las variables de entorno
    req.use_id = decoded.use_id; // Asigna el ID del usuario al objeto de solicitud
    req.isAuthenticated = true;
    // Continuar con el siguiente middleware o ruta
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    req.isAuthenticated = false;
    // Enviar una respuesta de error 401 si la verificación falla
    return res.status(401).send({ error: tokenVerificationErrors[error.message] || 'Invalid token' });
  }
};
