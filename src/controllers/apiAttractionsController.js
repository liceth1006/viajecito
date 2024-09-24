import axios, { Axios } from "axios";

//datos del api
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "9c7be886bcmsh39490f62171de4fp1c9197jsn2e944440c5a4",
    "x-rapidapi-host": "booking-com15.p.rapidapi.com",
  },
};

// funciom obtener atracciones
export const getApiAttractions = async (req, res) => {
  const { sortBy, startDate, endDate, id } = req.query;

  // Obtener la fecha de hoy y formatearla como 'YYYY-MM-DD'
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  // Crear la fecha de checkout sumando un día a checkin_date
  const checkinDateObj = new Date(formattedDate);
  checkinDateObj.setDate(checkinDateObj.getDate() + 1);
  const formattedCheckoutDate =
  endDate || checkinDateObj.toISOString().split("T")[0];

  const order_By = sortBy || "trending";
  const checkin = startDate || formattedDate;
  const checkout = endDate || formattedCheckoutDate;  
  const destId = id || "eyJ1ZmkiOjIwMDgwNjM0fQ==";

  const URL_SEARCH_ATRACTIONS = `https://booking-com15.p.rapidapi.com/api/v1/attraction/searchAttractions?id=${destId}&startDate=${checkin}&endDate=${checkout}&sortBy=${order_By}&currency_code=COP&languagecode=es`;

  try {
    const response = await axios.get(URL_SEARCH_ATRACTIONS, {
      headers: options.headers,
    });
    const result = response.data.data.products;

    if (req.path === "/attractionsprivate") {
      res.render("attractions", { layout: "privateLayout", items: result });
    } else if (req.path === "/attractionspublic") {
      res.render("attractions", { items: result });
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
export const detailsApiAttractions = async (req, res) => {
  const slugId = req.params.slug;

  const URL_DETAILS_ATTRACTIONS = `https://booking-com15.p.rapidapi.com/api/v1/attraction/getAttractionDetails?slug=${slugId}&languagecode=es&currency_code=COP`;
  
  try {
    const [detailsResponse] =
      await Promise.all([
        retryRequest(URL_DETAILS_ATTRACTIONS, { headers: options.headers }),
      ]);

    const details = detailsResponse.data.data;
    const reviews = details.reviews.reviews
    const photosArray = details.photos;
    const photos1 = photosArray[0] || {};
    const photos2 = photosArray[1] || {};
    const photos3 = photosArray[2] || {};

    if (req.path == `/attractionsDetailsPrivate/${slugId}`) {
      res.render("attractionsDetails", {
        layout: "privateLayout",
        details,
        photos1,
        photos2,
        photos3,
        reviews
      });
    } else if (req.path === `//attractionsDetails/${slugId}`) {
      res.render("attractionsDetails", {
        details,
        photos1,
        photos2,
        photos3,
        reviews
      });
    } else {
      res.status(404).send("Página no encontrada");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};


