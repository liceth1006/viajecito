import express from "express";
import { getApiBooking,searchDestination,detailsApiBooking} from '../controllers/apiBookingController.js';

const router = express.Router();

// Ruta para mostrar la página de inicio con los hoteles
router.get("/", searchDestination);
router.get("/hotel", getApiBooking);
router.get("/hotelDetails/:hotel_id", detailsApiBooking);


export default router;
