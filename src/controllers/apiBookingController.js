import axios, { Axios } from "axios";

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "4b63e186f9msh973e823046a8fe3p110c93jsn5d4fcdb0c180",
    "x-rapidapi-host": "booking-com.p.rapidapi.com",
  },
};

export const searchDestination = async (req, res) => {
  const { name } = req.query;
  const nameLocation = name || "colombia";
  const URL_SEARCH_DES = `https://booking-com.p.rapidapi.com/v1/hotels/locations?locale=es&name=${nameLocation}`;
  try {
    const response = await axios.get(URL_SEARCH_DES, {
      headers: options.headers,
    });
    const result = response.data;
    res.render("index", { items: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

export const getApiBooking = async (req, res) => {
  const {
    orderBy,
    checkin_date,
    checkout_date,
    room_number,
    children_number,
    adults_number,
  } = req.query;

  const order_By = orderBy || "popularity";
  const children = children_number || "2";
  const adult = adults_number || "2";
  const room = room_number || "1";

  // Obtener la fecha de hoy y formatearla como 'YYYY-MM-DD'
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  // Crear la fecha de checkout sumando un día a checkin_date
  const checkinDateObj = new Date(formattedDate);
  checkinDateObj.setDate(checkinDateObj.getDate() + 1);
  const formattedCheckoutDate =
    checkout_date || checkinDateObj.toISOString().split("T")[0];

  const checkin = checkin_date || formattedDate;
  const checkout = checkout_date || formattedCheckoutDate;
  const dest_type = "country" || "city";
  const dest_id = "47";

  const URL_SEARCH_HOTEL = `https://booking-com.p.rapidapi.com/v1/hotels/search?&adults_number=${adult}&children_number=${children}&room_number=${room}&include_adjacency=true&units=metric&checkout_date=${checkout}&dest_id=47&filter_by_currency=COP&dest_type=${dest_type}&checkin_date=${checkin}&order_by=${order_By}&locale=es`;

  try {
    const response = await axios.get(URL_SEARCH_HOTEL, {
      headers: options.headers,
    });
    const result = response.data.result;

    if (req.path === "/privatePage") {
      res.render('private/privatePage' , { layout: 'privateLayout',items: result }); 
    } else if (req.path === "/hotel") {
      res.render("publicPages/hotel", { items: result });
    } else {
      res.status(404).send("Página no encontrada");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

const retryRequest = async (url, options, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await axios.get(url, options);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Código de estado 429: Demasiadas Solicitudes
        attempt++;
        const delay = Math.pow(2, attempt) * 1000; // Retardo exponencial
        console.log(
          `Rate limit exceeded. Retrying in ${delay / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error; // Re-lanzar el error si no es un error de límite de tasa
      }
    }
  }
  throw new Error("Max retries exceeded");
};

export const detailsApiBooking = async (req, res) => {
  const hotelId = req.params.hotel_id;

  const URL_HOTEL_DETAILS = `https://booking-com.p.rapidapi.com/v1/hotels/data?hotel_id=${hotelId}&locale=es`;
  const URL_HOTEL_PHOTO = `https://booking-com.p.rapidapi.com/v1/hotels/photos?hotel_id=${hotelId}&locale=es`;

  try {
    const [detailsResponse, photosResponse] = await Promise.all([
      retryRequest(URL_HOTEL_DETAILS, { headers: options.headers }),
      retryRequest(URL_HOTEL_PHOTO, { headers: options.headers }),
    ]);

    const details = detailsResponse.data;

    // Buscar la descripción en español o tomar una descripción de cualquier idioma
    const descriptionTranslations = details.description_translations || [];
    const descriptionSpanish =
      descriptionTranslations.find((desc) => desc.languagecode === "es")
        ?.description || "Descripción no disponible";

    // Asegurarse de que photosResponse.data tiene al menos 3 elementos
    const photosArray = photosResponse.data;
    const photos1 = photosArray[0] || {};
    const photos2 = photosArray[1] || {};
    const photos3 = photosArray[2] || {};

    console.log("foto", photos1);
    res.render("publicPages/hotelDetails", {
      details,
      photos1,
      photos2,
      photos3,
      descriptionSpanish,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};


// Controller para obtener hoteles favoritos
export const getApiBookingFavorite = async (req, res) => {
  const {
    orderBy,
    checkin_date,
    checkout_date,
    room_number,
    children_number,
    adults_number,
  } = req.query;
  const userId = req.use_id
  const order_By = orderBy || "popularity";
  const children = children_number || "2";
  const adult = adults_number || "2";
  const room = room_number || "1";

  // Obtener la fecha de hoy y formatearla como 'YYYY-MM-DD'
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  // Crear la fecha de checkout sumando un día a checkin_date
  const checkinDateObj = new Date(formattedDate);
  checkinDateObj.setDate(checkinDateObj.getDate() + 1);
  const formattedCheckoutDate =
    checkout_date || checkinDateObj.toISOString().split("T")[0];

  const checkin = checkin_date || formattedDate;
  const checkout = checkout_date || formattedCheckoutDate;
  const dest_type = "country"; // Ajustado para un tipo fijo; puede ser dinámico si es necesario
  const dest_id = "47";

  const URL_SEARCH_HOTEL = `https://booking-com.p.rapidapi.com/v1/hotels/search?&adults_number=${adult}&children_number=${children}&room_number=${room}&include_adjacency=true&units=metric&checkout_date=${checkout}&dest_id=${dest_id}&filter_by_currency=COP&dest_type=${dest_type}&checkin_date=${checkin}&order_by=${order_By}&locale=es`;

  try {
    const response = await axios.get(URL_SEARCH_HOTEL, {
      headers: options.headers,
    });
    const result = response.data.result;

    let filteredResult = result;
    if (userId) {
      const [favorites] = await pool.query("SELECT property_id FROM favorites WHERE user_id = ?", [userId]);

      if (favorites.length > 0) {
        const favoriteIds = favorites.map(fav => fav.property_id);
        filteredResult = result.filter(hotel => favoriteIds.includes(hotel.id));
      }
    }
    return res.json(filteredResult);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};
