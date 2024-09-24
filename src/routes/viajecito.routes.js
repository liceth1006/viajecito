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
  deleteFavorite,
  getFavorite,
  postFavorite,
} from "../controllers/favoriteController.js";
import { detailsApiAttractions, getApiAttractions } from "../controllers/apiAttractionsController.js";
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

//hoteles
router.get("/", searchDestination);
router.get("/private", searchDestination);
router.get("/hotelpublic", getApiBooking);
router.get("/hotelprivate", getApiBooking);
router.get("/hotelDetails/:hotel_id", detailsApiBooking);
router.get("/hotelDetailsPrivate/:hotel_id", detailsApiBooking);



//atracciones
router.get("/attractionspublic", getApiAttractions);
router.get("/attractionsprivate", getApiAttractions);
router.get("/attractionsDetails/:slug", detailsApiAttractions);
router.get("/attractionsDetailsPrivate/:slug", detailsApiAttractions);



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

router.get("/favorite", (req, res) => {
  try {
    res.render('private/favorite' , { layout: 'privateLayout' }); 
  } catch (error) {
    console.error("Error en la ruta protegida:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/profilePage", (req, res) => {
  try {
    res.render('private/profile' , { layout: 'privateLayout' }); 
  } catch (error) {
    console.error("Error en la ruta protegida:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/profile", requireToken, profile);
router.get("/favoriteShow",requireToken, getFavorite);
router.post("/favoritePrivate", requireToken, postFavorite);
router.post("/checkFavorite", requireToken, checkFavorite)
router.delete("/delete/:id", deleteFavorite);

export default router;
