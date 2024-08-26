import bcrypt from 'bcrypt';

// Función para cifrar la contraseña antes de guardarla en la base de datos
export const hashPassword = async(password) =>{
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}