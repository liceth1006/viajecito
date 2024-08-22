import express from "express";
import { getApiBooking,detailsApiBooking } from '../controllers/apiBookingController.js';

const router = express.Router();

// Ruta para mostrar la página de inicio con los hoteles
router.get("/", getApiBooking);
router.get("/hotel", getApiBooking);
router.get("/hotelDetails/:id", detailsApiBooking);


export default router;
