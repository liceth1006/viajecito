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

document.addEventListener("DOMContentLoaded", () => {
  console.log("enviooo");

  // Evento para el formulario de inicio de sesión
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginFormSubmit);
  }

  // Llama a la función para actualizar la información del usuario
  updateUserInfo();

  // Evento para el botón de logout
  const logoutButton = document.getElementById("confirmLogout");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  // Llama a la función para manejar el formulario de ordenación
  handleSortForm();
});

