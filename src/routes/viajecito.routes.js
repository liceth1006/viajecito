import express from "express";
import { getApiBooking,searchDestination,detailsApiBooking, getApiBookingFavorite} from '../controllers/apiBookingController.js';
import {registerUser,login,logout,profile} from '../controllers/authController.js'
import { requireToken } from "../middlewares/requireToken.js";
import { getFavorite, postFavorite } from "../controllers/favoriteController.js";
const router = express.Router();


//rutas login,register,logout
router.post("/login", login);
router.post("/register", registerUser);
// Ruta para salir de la sesion
router.post("/logout", logout);
// Ruta para mostrar la página de inicio con los hoteles rutas publicas 
//router.get("/", searchDestination);
router.get("/hotel", getApiBooking);
router.get("/hotelDetails/:hotel_id", detailsApiBooking);

// Rutas protegidas (requieren autenticación)


router.get('/protectedRoute', requireToken, (req, res) => {
  try {
    console.log("Ruta protegida accedida");
    res.status(200).json({ message: 'Acceso a ruta protegida exitoso' });
  } catch (error) {
    console.error('Error en la ruta protegida:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.get('/', (req, res) => {
  try {
    console.log("Ruta protegida accedida");
    res.render("index");
  } catch (error) {
    console.error('Error en la ruta protegida:', error);
    res.status(500).send('Error interno del servidor');
  }
});






// router.get('/privatePage', (req, res) => {
//   res.render('private/privatePage' , { layout: 'privateLayout' }); 
// });

router.get('/favoritePublic', (req, res) => {
  res.render('publicPages/favoritePublic' ); 
});

router.get("/profile",requireToken, profile);
router.get("/favoritePrivate",requireToken, getApiBookingFavorite);

router.post("/favoritePrivate",requireToken, postFavorite);
router.get("/privatePage", getApiBooking);

router.post("/postFavorite/:hotel_id",requireToken,postFavorite)


export default router;
