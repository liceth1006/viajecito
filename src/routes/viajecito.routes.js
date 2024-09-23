import express from "express";
import {
  getApiBooking,
  searchDestination,
  detailsApiBooking,
} from "../controllers/apiBookingController.js";
import {
  registerUser,
  login,
  logout,
  profile,
} from "../controllers/authController.js";
import { requireToken } from "../middlewares/requireToken.js";
import {
  checkFavorite,
  getFavorite,
  postFavorite,
} from "../controllers/favoriteController.js";
const router = express.Router();

//rutas login,register,logout
router.post("/login", login);
router.post("/register", registerUser);
router.post("/logout", logout);

// Ruta para mostrar la página de inicio con los hoteles rutas publicas
router.get("/favoritePublic", (req, res) => {
  res.render("publicPages/favoritePublic");
});

router.get("/bookingPublic", (req, res) => {
  res.render("publicPages/bookingPublic");
});

router.get("/", searchDestination);
router.get("/private", searchDestination);
router.get("/hotelpublic", getApiBooking);
router.get("/hotelprivate", getApiBooking);
router.get("/hotelDetails/:hotel_id", detailsApiBooking);
router.get("/hotelDetailsPrivate/:hotel_id", detailsApiBooking);





// Rutas protegidas (requieren autenticación)

router.get("/protectedRoute", requireToken, (req, res) => {
  try {
    console.log("Ruta protegida accedida");
    res.status(200).json({ message: "Acceso a ruta protegida exitoso" });
  } catch (error) {
    console.error("Error en la ruta protegida:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/profile", requireToken, profile);
router.get("/favoriteShow",requireToken, getFavorite);
router.post("/favoritePrivate", requireToken, postFavorite);
router.post("/checkFavorite", requireToken, checkFavorite)

export default router;
