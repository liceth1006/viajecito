import express from "express";
import { getApiBooking,detailsApiBooking,searchDestination } from '../controllers/apiBookingController.js';

const router = express.Router();

// Ruta para mostrar la página de inicio con los hoteles
router.get("/", searchDestination);
router.get("/hotel", getApiBooking);
// router.get("/hotelDetails/:id", detailsApiBooking);


export default router;
