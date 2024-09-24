// Función para manejar el envío del formulario de inicio de sesión
async function handleLoginFormSubmit(event) {
  event.preventDefault();

  const email = document.getElementById("use_mail").value;
  const password = document.getElementById("use_password").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ use_mail: email, use_password: password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.userId);
      await accessProtectedRoute();
    } else {
      alertSweet("error", "Oops...", data.error);
    }
  } catch (error) {
    alertSweet("error", "Error", "Ocurrió un error al intentar iniciar sesión.");
  }
}

// Función para manejar el envío del formulario de registro
async function registerUser(event) {
  event.preventDefault();

  const formData = {
    use_mail: document.getElementById("user_mail").value,
    use_password: document.getElementById("user_password").value,
    use_name: document.getElementById("use_name").value,
    use_lastname: document.getElementById("use_lastname").value,
    use_birthdate: document.getElementById("use_birthdate").value,
  };
  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alertSweet("success", "Registro exitoso", data.message);
      document.getElementById("registerForm").reset();
    } else {
      alertSweet("error", "Oops...", data.error);
    }
  } catch (error) {
    alertSweet(
      "error",
      "Error",
      "Error al registrar el usuario. Inténtalo de nuevo."
    );
  }
}

// Función para acceder a la ruta protegida
async function accessProtectedRoute() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/protectedRoute", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      window.location.href = "/private";
    } else if (response.status === 401) {
      // Redirige a la página de login si el token no es válido
      window.location.href = "/login";
    } else {
      alert("Error al acceder a la ruta protegida.");
    }
  } catch (error) {
    console.error("Error:", error);
    alertSweet(
      "error",
      "Error",
      "Ocurrió un error al intentar acceder a la ruta protegida."
    );
  }
}

// Función para obtener los datos del usuario y actualizar el botón
async function updateUserInfo() {
  try {
    const response = await fetch("/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      const userNameElements = document.querySelectorAll(".userName");
      const birthdate = document.querySelector(".birthdate")
      const email = document.querySelector(".email")
      // Iterar sobre todos los elementos y actualizar su contenido
      userNameElements.forEach(element => {
        element.textContent = `${data.use_name} ${data.use_lastname}`;
      });
      // Convertir la fecha de nacimiento a un formato legible
      const formattedBirthdate = new Date(data.use_birthdate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      birthdate.textContent = formattedBirthdate;
      email.textContent = `${data.use_mail} `;
    } else {
      console.error("Error al obtener la información del usuario:", data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Función para manejar el logout
async function handleLogout() {
  try {
    const response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      alertSweet("success", "Salida exitosa", null);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    } else {
      alertSweet("error", "Error", data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}


// Función para manejar el formulario de ordenación
function handleSortForm(idForm,idOrder) {
  const form = document.getElementById(idForm);
  const select = document.getElementById(idOrder);
  if (form && select) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderBy = urlParams.get(idOrder);

    if (orderBy) {
      select.value = orderBy;
    }
    select.addEventListener("change", function () {
      form.submit();
    });
  }
}

//funcion buscar destino
function searchDestination() {
  const form = document.getElementById("destinationForm");
  const input = document.getElementById("name");

  // Verifica si el formulario y el input están presentes
  if (form && input) {
    // Obtiene los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);

    const name = urlParams.get("name");

    // Si hay un valor 'name' en la URL, se lo asigna al input
    if (name) {
      input.value = name;
    }
  }
}

//funcion filtro hoteles
function searchHotel() {
  const form = document.getElementById("FormHotel");
  const inputDestination = document.querySelector('select[name="dest_id"]');
  const inputArrival = document.getElementById("checkin_date");
  const inputDeparture = document.getElementById("checkout_date");
  const inputAdults = document.getElementById("adults_number");
  const inputChildren = document.getElementById("children_number");
  const inputRooms = document.getElementById("room_number");

  // Verifica si el formulario y los inputs están presentes
  if (form && inputDestination) {
    // Obtiene los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);

    // Asigna los valores de los parámetros a los inputs
    const destinationValue = urlParams.get("dest_id");
    const arrivalValue = urlParams.get("checkin_date");
    const departureValue = urlParams.get("checkout_date");
    const adultsValue = urlParams.get("adults_number");
    const childrenValue = urlParams.get("children_number");
    const roomsValue = urlParams.get("room_number");

    // Si hay valores, se los asigna a los inputs
    if (destinationValue) {
      inputDestination.value = destinationValue;
    }
    if (arrivalValue) {
      inputArrival.value = arrivalValue;
    }
    if (departureValue) {
      inputDeparture.value = departureValue;
    }
    if (adultsValue) {
      inputAdults.value = adultsValue;
    }
    if (childrenValue) {
      inputChildren.value = childrenValue;
    }
    if (roomsValue) {
      inputRooms.value = roomsValue;
    }
  }
}

// Función para guardar favorito
async function postFavorite(
  hotelId,
  hotelName,
  photoUrl,
  city,
  address,
  reviewScoreWord,
  reviewScore,
  amount_unrounded
) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  console.log(hotelId);

  try {
    const response = await fetch("/favoritePrivate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        use_id: user,
        hotel_id: hotelId,
        hotel_name_trans: hotelName,
        max_photo_url: photoUrl,
        city: city,
        address: address,
        review_score_word: reviewScoreWord,
        review_score: reviewScore,
        amount_unrounded: amount_unrounded,
      }),
    });

    const data = await response.json();
    checkFavorite(hotelId);
    if (response.ok) {
      alertSweet("success", "Registro exitoso", data.message);
    } else {
      alertSweet("error", "Oops...", data.message);
    }
  } catch (error) {
    console.error("Error al agregar favorito:", error);
  }
}

// Función para verificar si un hotel está en favoritos
async function checkFavorite(hotelId) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  try {
    const response = await fetch("/checkFavorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hotel_id: hotelId, use_id: user }),
    });

    const data = await response.json();

    // Cambia el color o el ícono si está en favoritos
    if (data.isFavorite) {
      document.getElementById(`img-${hotelId}`).src = "../img/iconFavorito.png";
      document.getElementById(hotelId).classList.add("favorite-active");
    }
  } catch (error) {
    console.error("Error al verificar favorito:", error);
  }
}

//funcion boton detalles
function viewHotel(hotelId) {
  // Obtener la ruta actual
  const currentPath = window.location.pathname;

  // Cambia la redirección según la ruta actual
  let url;
  if (currentPath === "/hotelpublic") {
    url = `/hotelDetails/${hotelId}`; 
  } else if (currentPath === "/hotelprivate") {
    url = `/hotelDetailsPrivate/${hotelId}`; 
  } else {
    url = `/hotelDetails/${hotelId}`; 
  }

  // Redirigir a la URL construida
  window.location.href = url;
}

//corazon favoritos hotel
function favoriteHeart () {
  const currentPath = window.location.pathname;
  const hotels = document.querySelectorAll("[id^=favoriteBtnContainer]");

  hotels.forEach((hotel) => {
    const hotelId = hotel.getAttribute("data-hotel-id");
    const hotelName = hotel.getAttribute("data-hotel-name");
    const photoUrl = hotel.getAttribute("data-photo-url");
    const city = hotel.getAttribute("data-city");
    const address = hotel.getAttribute("data-address");
    const reviewScoreWord = hotel.getAttribute("data-review-score-word");
    const reviewScore = hotel.getAttribute("data-review-score");
    const pricePerNight = hotel.getAttribute("data-price-per-night");

    if (currentPath === "/hotelprivate") {
      // Botón para favoritos privados
      hotel.innerHTML = `
      <div class="position-absolute top-0 end-0 button-10">
        <div id="${hotelId}" class="favorite p-2" onclick="postFavorite('${hotelId}', '${hotelName}', '${photoUrl}', '${city}','${address}','${reviewScoreWord}', '${reviewScore}', '${pricePerNight}')">
          <img id="img-${hotelId}" src="../img/iconNoFavorito.png" alt="Añadir a favoritos" />
        </div>
        </div>
      `;
    } else {
      // Botón para favoritos públicos
      hotel.innerHTML = `
       <div class="position-absolute top-0 end-0 button-10">
    <a class="favorite  p-2"  href="/favoritePublic">
          <img src="../img/iconNoFavorito.png" alt="Favorito" />
        </a>
</div>
      `;
    }
  });
};

// Función para obtener los favoritos
async function getFavorites() {
  console.log("Obteniendo favoritos...");
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/favoriteShow", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      renderFavorites(data); 
    } else {
      console.error("Error al obtener los favoritos:", data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Función para mostrar los favoritos en el DOM
function renderFavorites(favorites) {
  const favoritesContainer = document.getElementById("favoritesContainer");

  if (!favoritesContainer) {
    console.error("El contenedor de favoritos no existe en el DOM.");
    return;
  }

  favoritesContainer.innerHTML = "";
  favorites.forEach((favorite) => {
    const favoriteItem = document.createElement("div");
    favoriteItem.classList.add("col");
    favoriteItem.innerHTML = `
      <div class="card mb-3 h-100" style="max-width: 540px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              src="${favorite.max_photo_url}"
              class="img-fluid rounded-start"
              alt="Imagen del hotel ${favorite.hotel_name_trans}"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${favorite.hotel_name_trans}</h5>
              <p class="text-md-end text-success">
                <i class="fa-solid fa-ranking-star"></i>
                ${favorite.reviewScoreWord} (${favorite.reviewScore})
              </p>
              <div class="row">
                <div class="col-4">
                  <p><i class="fa-solid fa-tree-city text-success"></i> ${favorite.city}</p>
                </div>
                <div class="col-8">
                  <p><i class="fa-solid fa-location-dot text-primary"></i> ${favorite.address}</p>
                </div>
              </div>
              <h5>Precio por noche: ${favorite.amount_unrounded}</h5>
            </div>
           <div class="position-absolute top-0 end-0 ">
  <button class="btn  p-2" 
            onclick="deleteFavorite(${favorite.favorites_id})">
            <i class="fa-solid fa-trash-can fs-3 text-danger"></i>
          </button>
</div>
          </div>
          
        </div>

       
      </div>
    `;

    // Agregar la card al contenedor de favoritos
    favoritesContainer.appendChild(favoriteItem);
  });
}

//funcion eliminar favorito
async function deleteFavorite(favoriteId) {
  const confirmDelete = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará este favorito permanentemente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!confirmDelete.isConfirmed) return; // Solo proceder si el usuario confirma

  try {
    const response = await fetch(`/delete/${favoriteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Favorito eliminado",
        text: "El favorito ha sido eliminado exitosamente.",
        confirmButtonText: "Aceptar",
      });
      location.reload();
    } else {
      const errorData = await response.json();
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: `Ocurrió un error: ${errorData.message}`,
        confirmButtonText: "Aceptar",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: "Error al intentar eliminar el favorito. Inténtalo de nuevo más tarde.",
      confirmButtonText: "Aceptar",
    });
  }
}

//funcion alert
function alertSweet(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    confirmButtonColor: "#002B5B",
  });
}

// Función para establecer la acción del formulario select ordenby
function setFormAction() {
  const form = document.getElementById("sortForm");
  const currentPath = window.location.pathname;

  // Cambia la acción según la ruta actual
  if (currentPath === "/hotelpublic") {
    form.action = "/hotelpublic";
  } else if (currentPath === "/hotelprivate") {
    form.action = "/hotelprivate";
  }

  // Manejar el evento de cambio en el select
  const select = document.getElementById("orderBy");
  select.addEventListener("change", function () {
    form.submit();
  });
}

// Función para establecer la acción del formulario
function setFormAction(id, pachPublic, pachPrivate) {
  const form = document.getElementById(id);
  const currentPath = window.location.pathname;

  if (currentPath === pachPublic) {
    form.action = pachPublic;
  } else if (currentPath === pachPrivate) {
    form.action = pachPrivate;
  }
}

// Función para obtener la ruta actual y redirigir
function getCurrentPathAndRedirect(destId) {
  const currentPath = window.location.pathname;

  if (currentPath === "/") {
    window.location.href = `/hotelpublic?dest_id=${destId}`;
  } else if (currentPath === "/private") {
    window.location.href = `/hotelprivate?dest_id=${destId}`;
  } else {
    window.location.href = `/hotelpublic?dest_id=${destId}`;
  }
}


//funcion boton detalles
function viewAttractions(slug) {
  // Obtener la ruta actual
  const currentPath = window.location.pathname;

  // Cambia la redirección según la ruta actual
  let url;
  if (currentPath === "/attractionspublic") {
    url = `/attractionsDetails/${slug}`; 
  } else if (currentPath === "/attractionsprivate") {
    url = `/attractionsDetailsPrivate/${slug}`; 
  } else {
    url = `/attractionsDetails/${slug}`; 
  }

  // Redirigir a la URL construida
  window.location.href = url;
}


//funcion filtro atracciones
function searchAttractions() {
  const form = document.getElementById("FormAttractions");
  const inputDestination = document.querySelector('input[name="id"]');
  const inputArrival = document.getElementById("startDate");
  const inputDeparture = document.getElementById("endDate");

  // Verifica si el formulario y los inputs están presentes
  if (form && inputDestination) {
    // Obtiene los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);

    // Asigna los valores de los parámetros a los inputs
    const destinationValue = urlParams.get("id");
    const arrivalValue = urlParams.get("startDate");
    const departureValue = urlParams.get("endDate");
    // Si hay valores, se los asigna a los inputs
    if (destinationValue) {
      inputDestination.value = destinationValue;
    }
    if (arrivalValue) {
      inputArrival.value = arrivalValue;
    }
    if (departureValue) {
      inputDeparture.value = departureValue;
    }
  }
}

//corazon favoritos atracciones
function favoriteHeartAttractiones () {
  const currentPath = window.location.pathname;
  const hotels = document.querySelectorAll("[id^=favoriteBtnAttractions]");

  hotels.forEach((hotel) => {
    const hotelId = hotel.getAttribute("data-hotel-id");
    const hotelName = hotel.getAttribute("data-hotel-name");
    const photoUrl = hotel.getAttribute("data-photo-url");
    const city = hotel.getAttribute("data-city");
    const address = hotel.getAttribute("data-address");
    const reviewScoreWord = hotel.getAttribute("data-review-score-word");
    const reviewScore = hotel.getAttribute("data-review-score");
    const pricePerNight = hotel.getAttribute("data-price-per-night");
    if (currentPath === "/attractionsprivate") {
      // Botón para favoritos privados
      hotel.innerHTML = `
      <div class="position-absolute top-0 end-0 button-10">
        <div id="${hotelId}" class="favorite p-2" onclick="postFavorite('${hotelId}', '${hotelName}', '${photoUrl}', '${city}','${address}','${reviewScoreWord}', '${reviewScore}', '${pricePerNight}')">
          <img id="img-${hotelId}" src="../img/iconNoFavorito.png" alt="Añadir a favoritos" />
        </div>
        </div>
      `;
    } else {
      // Botón para favoritos públicos
      hotel.innerHTML = `
       <div class="position-absolute top-0 end-0 button-10">
    <a class="favorite  p-2"  href="/favoritePublic">
          <img src="../img/iconNoFavorito.png" alt="Favorito" />
        </a>
</div>
      `;
    }
  });
};










// Llama a las funciones al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
  updateUserInfo();
  getFavorites();
  searchDestination();
  handleSortForm("sortForm","orderBy")
  handleSortForm("sorAtttactionsForm","orderAtttactionsBy")
  setFormAction("destinationForm", "/", "/private");
  setFormAction("FormHotel", "/hotelpublic", "/hotelprivate");
  favoriteHeart()
  favoriteHeartAttractiones()
  // Evento para el botón de logout
  const logoutButton = document.getElementById("confirmLogout");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  const hotels = document.querySelectorAll(".favorite");
  hotels.forEach((hotel) => {
    const hotelId = hotel.id;
    checkFavorite(hotelId);
  });

  // Agregar la funcionalidad de los botones de ver hoteles
  const viewHotelsBtns = document.querySelectorAll(".viewHotelsBtn");
  viewHotelsBtns.forEach(function (button) {
    button.addEventListener("click", function () {
      const destId = button.getAttribute("data-dest-id");
      const destName = button.getAttribute("data-dest-name");
      
      // Guarda el dest_id y destName en el almacenamiento local
      localStorage.setItem("dest_id", destId);
      localStorage.setItem("name", destName);
      
      // Llama a la función para redirigir con el ID del destino
      getCurrentPathAndRedirect(destId);
    });
  });
});


