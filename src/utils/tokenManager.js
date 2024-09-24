import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Generar el token de acceso
export const generateToken = (userId) => {
  if (!'SflKxwRJSMeKKF2QT4fwpa') {
    throw new Error('JWT_SECRET not defined');
  }
  const token = jwt.sign({ use_id: userId }, 'SflKxwRJSMeKKF2QT4fwpa', { expiresIn: 9000 });
  
  return { token, expiresIn: 9000 };
};



export const tokenVerificationErrors = {
  "invalid signature": "La firma del JWT no es válida",
  "jwt expired": "JWT expirado",
  "invalid token": "Token no válido",
  "No Bearer": "Utiliza formato Bearer",
  "jwt malformed": "JWT formato no válido",
};