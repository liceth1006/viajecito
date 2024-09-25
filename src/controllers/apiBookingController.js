import axios, { Axios } from "axios";

//datos del api 
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "293fcda454msh923b527ff9d7033p1c8c32jsn39fba2b26563",
    "x-rapidapi-host": "booking-com.p.rapidapi.com",
  },
};

const option = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '293fcda454msh923b527ff9d7033p1c8c32jsn39fba2b26563',
    'x-rapidapi-host': 'booking-com.p.rapidapi.com'
  }
};

// funcion buscar destino - datos api
export const searchDestination = async (req, res) => {
  const { name } = req.query;
  const nameLocation = name || "colombia";
  const URL_SEARCH_DES = `https://booking-com.p.rapidapi.com/v1/hotels/locations?locale=es&name=${nameLocation}`;
  try {
    const response = await axios.get(URL_SEARCH_DES, {
      headers: option.headers,
    });
    const result = response.data;

    if (req.path === "/private") {
      res.render('index' , { layout: 'privateLayout',items: result }); 
    } else if (req.path === "/") {
      res.render("index", { items: result });
    } else {
      res.status(404).send("Página no encontrada");
    }
    
    
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

// funciom obtener hoteles
export const getApiBooking = async (req, res) => {
  const {
    orderBy,
    checkin_date,
    checkout_date,
    room_number,
    children_number,
    adults_number,
    dest_id
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
  const destId = dest_id || "47";

  const URL_SEARCH_HOTEL = `https://booking-com.p.rapidapi.com/v1/hotels/search?&adults_number=${adult}&children_number=${children}&room_number=${room}&include_adjacency=true&units=metric&checkout_date=${checkout}&dest_id=${destId}&filter_by_currency=COP&dest_type=${dest_type}&checkin_date=${checkin}&order_by=${order_By}&locale=es`;

  try {
    const response = await axios.get(URL_SEARCH_HOTEL, {
      headers: options.headers,
    });
    const result = response.data.result;

    if (req.path === "/hotelprivate") {
      res.render('hotel' , { layout: 'privateLayout',items: result }); 
    } else if (req.path === "/hotelpublic") {
      res.render("hotel", { items: result });
    } else {
      res.status(404).send("Página no encontrada");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};


//funcion para mejorar las solicitudes a la api
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

//funcion detalles de los hoteles
export const detailsApiBooking = async (req, res) => {
  const hotelId = req.params.hotel_id;

  const URL_HOTEL_DETAILS = `https://booking-com.p.rapidapi.com/v1/hotels/data?hotel_id=${hotelId}&locale=es`;
  const URL_HOTEL_PHOTO = `https://booking-com.p.rapidapi.com/v1/hotels/photos?hotel_id=${hotelId}&locale=es`;
  const URL_SEARCH_REVIEWS = `https://booking-com.p.rapidapi.com/v1/hotels/reviews?sort_type=SORT_MOST_RELEVANT&hotel_id=${hotelId}&locale=es`;
  try {
    const [detailsResponse, photosResponse,reviewsResponse] = await Promise.all([
      retryRequest(URL_HOTEL_DETAILS, { headers: options.headers }),
      retryRequest(URL_HOTEL_PHOTO, { headers: options.headers }),
      retryRequest(URL_SEARCH_REVIEWS, { headers: options.headers }),
    ]);

    const reviews = reviewsResponse.data.result
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

    if(req.path == `/hotelDetailsPrivate/${hotelId}`){
      res.render("hotelDetails", {
         layout: 'privateLayout',
        reviews,
        details,
        photos1,
        photos2,
        photos3,
        descriptionSpanish,
      },);
    } else if (req.path === `/hotelDetails/${hotelId}`) {
      res.render("hotelDetails",  {
       reviews,
       details,
       photos1,
       photos2,
       photos3,
       descriptionSpanish,
     },);
    } else {
      res.status(404).send("Página no encontrada");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};



