import axios, { Axios } from "axios";

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "6f00897639msh86987678ca2a162p198f92jsn361500abf0d8",
    "x-rapidapi-host": "booking-com.p.rapidapi.com",
  },
};

export const searchDestination = async (req, res) => {
  const name = "colombia"
  const URL_SEARCH_DES =`https://booking-com.p.rapidapi.com/v1/hotels/locations?locale=es&name=${name}`
  try {
    const response = await axios.get(URL_SEARCH_DES, {
      headers: options.headers,
    });
    const result = response.data;
    console.log(result)
    res.render("index", { items: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};



export const getApiBooking = async (req, res) => {
  const {orderBy} = req.query;
  const order_By = orderBy || "popularity";
  
  const URL_SEARCH_HOTEL = `https://booking-com.p.rapidapi.com/v1/hotels/search?children_ages=5%2C0&adults_number=2&children_number=2&room_number=1&include_adjacency=true&units=metric&checkout_date=2025-01-19&dest_id=47&filter_by_currency=COP&dest_type=country&checkin_date=2025-01-18&order_by=${order_By}&locale=es`
  try {
    const response = await axios.get(URL_SEARCH_HOTEL, { headers: options.headers });
    const result = response.data.result;
    console.log("este es",orderBy)
    if (req.path === "/") {
      res.render("index", { items: result });
    } else if (req.path === "/hotel") {
      res.render("hotel/hotel", { items: result });
    } else {
      res.status(404).send("Página no encontrada");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};





export const detailsApiBooking = async (req, res) => {
  const hotelId = req.params.id;

  try {
    const response = await axios.get(url, { headers: options.headers });
    const result = response.data.results;

    // Filtrar los detalles del hotel por ID
    const hotelDetails = result.find((hotel) => hotel.id == hotelId);
    // Verificar si se encontró el hotel
    if (hotelDetails) {
      // Renderizar la vista desde la carpeta 'hotel'
      res.render("hotel/hotelDetails", { item: hotelDetails });
    } else {
      res.status(404).send("Hotel no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};
