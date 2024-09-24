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
      alertSweet('error','Oops...',data.error)
      
    }
  } catch (error) {
    handleError(error);
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
console.log(formData)
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
      alertSweet('success','Registro exitoso',data.message)
      document.getElementById("registerForm").reset(); 
    } else {
      alertSweet('error','Oops...',data.error)
    }
  } catch (error) {
    alertSweet('error','Error','Error al registrar el usuario. Inténtalo de nuevo.')
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
    alertSweet('error','Error','Ocurrió un error al intentar acceder a la ruta protegida.')

  }
}

// Función para obtener los datos del usuario y actualizar el botón
async function updateUserInfo() {
  try {
    const response = await fetch('/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    const data = await response.json();

    if (response.ok) {
      const userNameElement = document.getElementById('userName');
      userNameElement.textContent = `${data.use_name} ${data.use_lastname}`;
    } else {
      console.error('Error al obtener la información del usuario:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Función para manejar el logout
async function handleLogout() {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();

    if (response.ok) {
      alertSweet('success','Salida exitosa',null)
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    } else {
      alertSweet('error','Error',data.error)
      
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Función para manejar el formulario de ordenación
function handleSortForm() {
  const form = document.getElementById('sortForm');
  const select = document.getElementById('orderBy');
  if (form && select) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderBy = urlParams.get('orderBy');

    if (orderBy) {
      select.value = orderBy;
    }
    select.addEventListener('change', function() {
      form.submit();
    });
  }
}


//funcion alert
 function alertSweet(icon,title,text){
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
     confirmButtonColor: '#002B5B'
  });
 }

//funcion buscar destino
function searchDestination (){

  const form = document.getElementById('destinationForm');
  const input = document.getElementById('name');

  // Verifica si el formulario y el input están presentes
  if (form && input) {
    // Obtiene los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    
    const name = urlParams.get('name');

    // Si hay un valor 'name' en la URL, se lo asigna al input
    if (name) {
      input.value = name;
    }
  }
}

//funcion filtro hoteles
function searchHotel() {
  const form = document.getElementById('FormHotel');
  const inputDestination = document.querySelector('select[name="dest_id"]');
  const inputArrival = document.getElementById('checkin_date');
  const inputDeparture = document.getElementById('checkout_date');
  const inputAdults = document.getElementById('adults_number');
  const inputChildren = document.getElementById('children_number');
  const inputRooms = document.getElementById('room_number');

  // Verifica si el formulario y los inputs están presentes
  if (form && inputDestination) {
    // Obtiene los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Asigna los valores de los parámetros a los inputs
    const destinationValue = urlParams.get('dest_id');
    const arrivalValue = urlParams.get('checkin_date');
    const departureValue = urlParams.get('checkout_date');
    const adultsValue = urlParams.get('adults_number');
    const childrenValue = urlParams.get('children_number');
    const roomsValue = urlParams.get('room_number');

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
async function postFavorite(hotelId, hotelName, photoUrl,city,address, reviewScoreWord, reviewScore, amount_unrounded) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  console.log(amount_unrounded);


  try {
    const response = await fetch('/favoritePrivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        use_id: user,
        hotel_id: hotelId,
        hotel_name_trans: hotelName,
        max_photo_url: photoUrl,
        city:city,
        address:address,
        review_score_word: reviewScoreWord,
        review_score: reviewScore,
        amount_unrounded: amount_unrounded 
      })
    });

    const data = await response.json();
    checkFavorite(hotelId)
    if (response.ok) {
      alertSweet('success', 'Registro exitoso', data.message);
    } else {
      alertSweet('error', 'Oops...', data.message);
    }
  } catch (error) {
    console.error('Error al agregar favorito:', error);
  }
}

// Función para verificar si un hotel está en favoritos
async function checkFavorite(hotelId) {
  const token = localStorage.getItem('token');
   const user = localStorage.getItem('user');
  try {
    const response = await fetch('/checkFavorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ hotel_id: hotelId, use_id:user  }) 
    });

    const data = await response.json();

    // Cambia el color o el ícono si está en favoritos
    if (data.isFavorite) {
      document.getElementById(`img-${hotelId}`).src = "../img/iconFavorito.png";
      document.getElementById(hotelId).classList.add('favorite-active'); // Puedes agregar una clase CSS para cambiar el color
    }
  } catch (error) {
    console.error('Error al verificar favorito:', error);
  }
}

//funcion boton detalles 
function viewHotel(hotelId) {
  // Obtener la ruta actual
  const currentPath = window.location.pathname;
  
  // Cambia la redirección según la ruta actual
  let url;
  if (currentPath === "/hotelpublic") {
    url = `/hotelDetails/${hotelId}`; // Redirigir a la ruta pública
  } else if (currentPath === "/hotelprivate") {
    url = `/hotelDetailsPrivate/${hotelId}`; // Redirigir a la ruta privada
  } else {
    url = `/hotelDetails/${hotelId}`; // Ruta por defecto
  }
  
  // Redirigir a la URL construida
  window.location.href = url;
}

//corazon favoritos
document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  const hotels = document.querySelectorAll('[id^=favoriteBtnContainer]');

  hotels.forEach(hotel => {
    const hotelId = hotel.getAttribute('data-hotel-id');
    const hotelName = hotel.getAttribute('data-hotel-name');
    const photoUrl = hotel.getAttribute('data-photo-url');
    const city = hotel.getAttribute('data-city');
    const address = hotel.getAttribute('data-address');
    const reviewScoreWord = hotel.getAttribute('data-review-score-word');
    const reviewScore = hotel.getAttribute('data-review-score');
    const pricePerNight = hotel.getAttribute('data-price-per-night');

    if (currentPath === '/hotelprivate') {
      // Botón para favoritos privados
      hotel.innerHTML = `
        <div id="${hotelId}" class="favorite" onclick="postFavorite('${hotelId}', '${hotelName}', '${photoUrl}', '${city}','${address}','${reviewScoreWord}', '${reviewScore}', '${pricePerNight}')">
          <img id="img-${hotelId}" src="../img/iconNoFavorito.png" alt="Añadir a favoritos" />
        </div>
      `;
    } else {
      // Botón para favoritos públicos
      hotel.innerHTML = `
        <a class="favorite" href="/favoritePublic">
          <img src="../img/iconNoFavorito.png" alt="Favorito" />
        </a>
      `;
    }
  });
});



// Función para obtener los favoritos
async function getFavorites() {
  console.log("Obteniendo favoritos...");
  const token = localStorage.getItem('token'); 

  try {
    const response = await fetch('/favoriteShow', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Pasa el token en el encabezado
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Favoritos obtenidos:', data);
      renderFavorites(data); // Muestra los favoritos en el DOM
    } else {
      console.error('Error al obtener los favoritos:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Función para mostrar los favoritos en el DOM
function renderFavorites(favorites) {
  const favoritesContainer = document.getElementById('favoritesContainer');
  
  if (!favoritesContainer) {
    console.error('El contenedor de favoritos no existe en el DOM.');
    return;
  }

  favoritesContainer.innerHTML = ''; // Limpia cualquier contenido previo

  favorites.forEach(favorite => {
    const favoriteItem = document.createElement('div');
    favoriteItem.classList.add('col'); // Clase para las columnas de Bootstrap

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
           <div class="position-absolute top-0 end-0 button-10">
  <a href="/delete/${favorite.favorites_id}" class="btn btn-danger p-2" 
     onclick="return confirm('¿Estás seguro de que deseas eliminar este favorito?');">
    <i class="fa-solid fa-trash-can fs-3 text-danger"></i>
  </a>
</div>
          </div>
          
        </div>

       
      </div>
    `;

    // Agregar la card al contenedor de favoritos
    favoritesContainer.appendChild(favoriteItem);
  });
}

async function deleteFavorite(favoriteId) {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este favorito?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`/delete/${favoriteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Aquí puedes agregar lógica para actualizar la interfaz, como eliminar el elemento de la lista
      alert('Favorite deleted successfully!');
      location.reload(); // Recarga la página o actualiza la lista
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    alert('Error al intentar eliminar el favorito. Inténtalo de nuevo más tarde.');
  }
}




  // Función para establecer la acción del formulario
  function setFormAction() {
    const form = document.getElementById('sortForm');
    const currentPath = window.location.pathname;

    // Cambia la acción según la ruta actual
    if (currentPath === "/hotelpublic") {
      form.action = "/hotelpublic";
    } else if (currentPath === "/hotelprivate") {
      form.action = "/hotelprivate";
    }

    // Manejar el evento de cambio en el select
    const select = document.getElementById('orderBy');
    select.addEventListener('change', function() {
      form.submit();
    });
  }

// Función para establecer la acción del formulario
function setFormAction(id,pachPublic, pachPrivate) {
  const form = document.getElementById(id);
  const currentPath = window.location.pathname;

  if (currentPath === pachPublic) {
    form.action = pachPublic; 
  } else if (currentPath === pachPrivate) {
    form.action = pachPrivate; 
  }


}

//mostrar lo hoteles segun el lugar seleccionado
document.addEventListener('DOMContentLoaded', function() {
  // Función para obtener la ruta actual y redirigir
  function getCurrentPathAndRedirect(destId) {
    const currentPath = window.location.pathname;

    if (currentPath === '/') {
      window.location.href = `/hotelpublic?dest_id=${destId}`;
    } else if (currentPath === '/private') {
      window.location.href = `/hotelprivate?dest_id=${destId}`;
    } else {
      window.location.href = `/hotelpublic?dest_id=${destId}`; // Ruta predeterminada
    }
  }

  // Selecciona todos los botones con la clase 'viewHotelsBtn'
  const viewHotelsBtns = document.querySelectorAll('.viewHotelsBtn');

  // Agrega un evento de clic a cada botón
  viewHotelsBtns.forEach(function(button) {
    button.addEventListener('click', function() {
      // Obtén el dest_id del atributo data-dest-id
      const destId = button.getAttribute('data-dest-id');
      const destName = button.getAttribute('data-dest-name');
      // Guarda el dest_id y destName en el almacenamiento local
      localStorage.setItem('dest_id', destId);
      localStorage.setItem('name', destName);

      // Llama a la función para redirigir con el ID del destino
      getCurrentPathAndRedirect(destId);
    });
  });
});



// Llama a la función al cargar
searchDestination();


// Llama a la función cuando se carga el documento
document.addEventListener('DOMContentLoaded', searchDestination);

















document.addEventListener("DOMContentLoaded", () => {
  updateUserInfo();
  getFavorites()
  
  // Evento para el botón de logout
  const logoutButton = document.getElementById("confirmLogout");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  // Llama a la función para manejar el formulario de ordenación
  handleSortForm();
  searchDestination()
  setFormAction()
  
setFormAction('destinationForm',"/","/private");
setFormAction('FormHotel',"/hotelpublic","/hotelprivate");
  const hotels = document.querySelectorAll('.favorite');
    hotels.forEach((hotel) => {
      const hotelId = hotel.id;
      checkFavorite(hotelId);
    });
});


// Función para manejar errores generales
function handleError(error) {
  alertSweet('error','Error','Ocurrió un error al intentar iniciar sesión.')
  
}