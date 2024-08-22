import axios from "axios";

const url = 'https://booking-com.p.rapidapi.com/v2/hotels/search?dest_id=-553173&order_by=popularity&checkout_date=2025-01-19&children_number=2&filter_by_currency=AED&locale=en-gb&dest_type=city&checkin_date=2025-01-18&children_ages=5,0&include_adjacency=true&page_number=0&adults_number=2&room_number=1&units=metric';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '6f00897639msh86987678ca2a162p198f92jsn361500abf0d8',
    'x-rapidapi-host': 'booking-com.p.rapidapi.com'
  }
};

export const getApiBooking = async (req, res) => {
  try {
    const response = await axios.get(url, { headers: options.headers });
    const result = response.data.results;
    if (req.path === '/') {
      res.render('index', { items: result });
    } else if (req.path === '/hotel') {
      res.render('hotel/hotel', { items: result });
    } else {
      res.status(404).send('Página no encontrada');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

export const detailsApiBooking = async (req, res) => {
  const hotelId = req.params.id; 

  try {
    const response = await axios.get(url, { headers: options.headers });
    const result = response.data.results;

    // Filtrar los detalles del hotel por ID
    const hotelDetails = result.find(hotel => hotel.id == hotelId);
    console.log("este es el hotel!",hotelDetails);
    // Verificar si se encontró el hotel
    if (hotelDetails) {
      console.log("este es el hotel!",hotelDetails);
      // Renderizar la vista desde la carpeta 'hotel'
      res.render('hotel/hotelDetails', { item: hotelDetails });
    } else {
      res.status(404).send('Hotel no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};


