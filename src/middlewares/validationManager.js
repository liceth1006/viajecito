import {  body, cookie, header, validationResult } from "express-validator";


/*Esta función es un middleware  se utiliza para manejar los resultados de validación. 
Comprueba si hay errores de validación en la solicitud y,
 en caso de que los haya, responde con un código de estado 400 
 https://express-validator.github.io/docs/guides/validation-chain
 */
export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/* Este es un conjunto de validaciones para la ruta  relacionado con el registro y login  de usuarios . 
Se validan campos como el "email," "password" y "repassword" para asegurarse de que cumplan con ciertos criterios, 
como formato de email válido y longitud mínima de contraseña. 
También se verifica si las contraseñas coinciden.
*/

export const bodyRegisterValidator = [
  body("email", "formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("repassword", "formato de password incorrecto").trim(),
  body("password", "formato de password incorrecto")
    .trim()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .custom((value, { req }) => {
      if (value !== req.body.repassword) {
        throw new Error("las contraseñas no coinciden");
      }

      return value;
    }),

  validationResultExpress,
];


export const bodyLoginrValidator = [
  body("email", "formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "La contraseña debe tener al menos 6 caracteres")
    .trim()
    .isLength({ min: 6 }),
  validationResultExpress,
];

export const bodyPoolValidator = [
  body("name", "El nombre de la piscina es obligatorio").trim().notEmpty(),
  body("type", "El tipo de piscina es obligatorio").trim().isIn(["rectangular", "circular"]),
  body("description", "La descripción de la piscina debe ser una cadena").optional().isString(),
  validationResultExpress,
];

