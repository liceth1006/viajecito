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
      // Guarda el token en el almacenamiento local
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.userId);
      // Llama a una función que maneje la solicitud a la ruta protegida
      await accessProtectedRoute();
    } else {
      // Maneja el error de inicio de sesión
      alert(data.error);
    }
  } catch (error) {
    handleError(error);
  }
}

// Función para manejar errores generales
function handleError(error) {
  console.error("Error:", error);
  alert("Ocurrió un error al intentar iniciar sesión.");
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
      window.location.href = "/privatePage";
    } else if (response.status === 401) {
      // Redirige a la página de login si el token no es válido
      window.location.href = "/login";
    } else {
      alert("Error al acceder a la ruta protegida.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error al intentar acceder a la ruta protegida.");
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
      alert("Salida exitosa");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    } else {
      alert(data.error);
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

    // Escucha el cambio y envía el formulario
    select.addEventListener('change', function() {
      form.submit();
    });
  }
}

//funcion para guardar favorito
async function postFavorite(hotelId) {
  const token = localStorage.getItem('token');
const img = document.getElementById(`img-${hotelId}`)
  try {
    const response = await fetch(`/postFavorite/${hotelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      console.log("Hotel ID:", hotelId);
      console.log("Agregado a favoritos");
       // Cambiar imagen para reflejar el estado de favorito
        img.src = "../img/iconFavorito.png";
    } else {
      console.log('Error al agregar favorito');
    }
  } catch (error) {
    console.error('Error al agregar favorito:', error);
  }
}


// Función para obtener los favoritos
async function getFavorite() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token en el localStorage.');
      return;
    }

    const response = await fetch('/favoritePrivate', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();
    if (response.ok) {
      const container = document.getElementById('hotelsContainer');
      container.innerHTML = '';
console.log(data)
      // if (data.length > 0) {
      //   data.forEach(hotel => {
      //     const hotelCard = `
      //       <div class="card h-100">
      //         <div class="image-container">
      //           <img src="${hotel.max_photo_url || ''}" class="card-img-top" alt="${hotel.hotel_name_trans || 'Hotel'}"/>
      //         </div>
      //         <div class="card-body">
      //           <h4 class="card-title">${hotel.hotel_name_trans || 'Nombre del Hotel'}</h4>
      //           <p class="text-md-end text-success">
      //             <i class="fa-solid fa-ranking-star"></i>
      //             ${hotel.review_score_word || 'Sin Calificación'} (${hotel.review_score || '0'})
      //           </p>
      //           <div class="row">
      //             <div class="col-4">
      //               <p><i class="fa-solid fa-tree-city text-success"></i> ${hotel.city || 'Ciudad'}</p>
      //             </div>
      //             <div class="col-8">
      //               <p><i class="fa-solid fa-location-dot text-primary"></i> ${hotel.address || 'Dirección'}</p>
      //             </div>
      //           </div>
      //           <h4>Precio por noche: ${hotel.composite_price_breakdown?.gross_amount_per_night?.amount_unrounded || 'N/A'}</h4>
      //           <h4>Precio Total: ${hotel.composite_price_breakdown?.all_inclusive_amount?.amount_rounded || 'N/A'}</h4>
      //           <p class="card-text mb-0">${hotel.ribbon_text || 'Texto del Rango'}</p>
      //           <p class="card-text mb-0">Cancelación gratuita: ${hotel.is_free_cancellable ? '<span class="text-success mb-0">Sí</span>' : '<span class="text-danger mb-0">No</span>'}</p>
      //           <p class="card-text mb-0">Pago por adelantado: ${hotel.cc_required ? '<span class="text-success">Requerido</span>' : '<span class="text-danger">No requerido</span>'}</p>
      //           <p class="card-text mb-0">Check-in: desde ${hotel.checkin?.from || 'N/A'} hasta ${hotel.checkin?.until || 'N/A'}</p>
      //           <p class="card-text mb-0">Check-out: desde ${hotel.checkout?.from || 'N/A'} hasta ${hotel.checkout?.until || 'N/A'}</p>
      //           <div class="d-grid gap-2 col-6 mx-auto mt-2">
      //             <a href="/hotelDetails/${hotel.hotel_id || ''}" class="button">
      //               <span>Ver disponibilidad <i class="fa-solid fa-chevron-right"></i></span>
      //             </a>
      //           </div>
      //           <div class="position-absolute top-0 end-0 p-3">
      //             ${hotel.badges ? hotel.badges.map(badge => `<span class="badge bg-success mb-0">${badge.text}</span>`).join('') : ''}
      //           </div>
      //         </div>
      //         <div id="${hotel.hotel_id}" class="favorite" onclick="postFavorite('${hotel.hotel_id}')">
      //           <img id="img-${hotel.hotel_id}" src="../img/iconNoFavorito.png" alt="Añadir a favoritos" />
      //         </div>
      //       </div>
      //     `;
      //     container.innerHTML += hotelCard;
      //   });
      // } else {
      //   container.innerHTML = '<p>No hay favoritos para mostrar.</p>';
      // }
    } else {
      console.error('Error al obtener la información del usuario:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}








document.addEventListener("DOMContentLoaded", () => {
  console.log("enviooo");

  // Evento para el formulario de inicio de sesión
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginFormSubmit);
  }

  // Llama a la función para actualizar la información del usuario
  updateUserInfo();
  getFavorite()

  // Evento para el botón de logout
  const logoutButton = document.getElementById("confirmLogout");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  // Llama a la función para manejar el formulario de ordenación
  handleSortForm();
});

