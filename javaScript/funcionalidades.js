document.addEventListener("DOMContentLoaded", () => {
  const userSection = document.getElementById("seccionUsuario");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) { 
    const primerNombre = usuario.nombre.trim().split(" ")[0];
    userSection.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-danger py-3 px-xxl-5 dropdown-toggle backgroundHover-rojo d-flex align-items-center justify-content-center" 
                type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false" style="width:100%;">
          <i class="bi bi-person-circle me-2"></i> ${primerNombre}
        </button>
        <ul class="dropdown-menu text-center" aria-labelledby="userMenu">
          <li><a class="dropdown-item " href="#" data-bs-toggle="modal" data-bs-target="#modalDatosUsuario">Datos Personales</a></li>
          <li><a class="dropdown-item " href="cambiarcontraseña.html">Cambiar contraseña</a></li>
          <li><a class="dropdown-item fw-semibold" href="misPedidos.html">Mis pedidos</a></li>
          <li><a class="dropdown-item fw-bold" style="color:rgb(228, 30, 30);" href="#" id="cerrarSesion">Cerrar sesión</a></li>
        </ul>
      </div>
    `;

    const botonVerMisPedidos = document.getElementById("botonVerMisPedidos");
    botonVerMisPedidos.disabled=false;
    
    botonVerMisPedidos.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "misPedidos.html";
    })

    document.getElementById("cerrarSesion").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuario");
      localStorage.removeItem("carrito");
      window.location.href = "index.html";
    });
  }
});




//Funcion para agregar o disminuir la cantidad de productos en las tarjetas
function updateQty(btn, change) {
      const input = btn.parentNode.querySelector("input");
      let value = parseInt(input.value) || 1;
      value += change;
      if (value < 1) value = 1;
      input.value = value;
}

//funcion para el menú desplegable de productos
document.querySelectorAll('.dropdown-menu [data-bs-toggle="dropdown"]').forEach(function(element) {
    element.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  

/*funcionalidades del carrito de compras*/

// Función para obtener el url de la imagen de un producto
  function getImageUrl(producto) {
    return `https://backend-proyecto-distribuidora-production.up.railway.app/images/productos/${producto}.jpg`;
  }

// Funciones para manejar localStorage
function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function saveCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Renderizar carrito
function renderCarrito() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  let carrito = getCarrito();

  cartItems.innerHTML = "";
  let total = 0;

  carrito.forEach(producto => {
    let subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    let item = document.createElement("div");
    item.classList.add("cart-item", "shadow");

    item.innerHTML = `
      <div class="d-flex align-items-center">
        <a href="producto-info.html?id=${producto.id}">
          <img src="${getImageUrl(producto.nombre)}" alt="${producto.nombre}" class="product-img me-2" 
          onerror="this.onerror=null; this.src='https://backend-proyecto-distribuidora-production.up.railway.app/images/default.jpg';">
        </a>
        <span class="text-truncate product-name"><a href="producto-info.html?id=${producto.id}" class="text-dark text-truncate product-name">${producto.nombre}</a></span>
      </div>
      <div class="d-flex align-items-center product-actions">
        <div class="input-group input-group-sm me-1">
          <button class="btn" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
          <input type="text" class="form-control text-center cantidadProducto" value="${producto.cantidad}" readonly>
          <button class="btn" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
        </div>
        <span class="text-danger fw-bold me-2">Total: S/.${subtotal.toLocaleString()}</span>
        <button class="btn btn-remove ms-5" onclick="eliminarProducto(${producto.id})">✕</button>
      </div>
    `;
    cartItems.appendChild(item);
  });

  cartTotal.textContent = "S/." + total.toLocaleString();
}


function cambiarCantidad(id, delta) {
  let carrito = getCarrito();
  let producto = carrito.find(p => p.id === id);
  if (!producto) return;

  producto.cantidad += delta;
  if (producto.cantidad < 1) producto.cantidad = 1;

  saveCarrito(carrito);
  renderCarrito();
}


function eliminarProducto(id) {
  let carrito = getCarrito().filter(p => p.id !== id);
  saveCarrito(carrito);
  renderCarrito();
}


function vaciarCarrito() {
  saveCarrito([]);
  renderCarrito();
}


function finalizarPedido() {
  const usuarioExiste = JSON.parse(localStorage.getItem("usuario"));
  //se verifica si el usuario inicio sesion o no
  if(usuarioExiste){
    window.location.href = "finalizarPedido.html";
  }else{
    mostrarModal('¡Registrate para continuar!','Debe iniciar sesion para poder realizar un pedido, utilice el botón Ingresar.');
  }
  
}


document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
});

//cargar productos al presionar el botón del carrito
const botonesCarrito = document.querySelectorAll('[data-bs-target="#cartModal"]');
Array.from(botonesCarrito).forEach(function(boton) {
  boton.addEventListener('click', function() {
      renderCarrito();
  });
});

/*Fin del carrito de compras */ 


/*Funcion boton flotante*/
const btnArriba = document.getElementById("btnArriba");
const btnCarrito = document.getElementById("btnCarrito");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    btnArriba.classList.add("show");
    btnCarrito.classList.add("show");
  } else {
    btnArriba.classList.remove("show");
    btnCarrito.classList.remove("show");
  }
});

btnArriba.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
/*Fin boton flotante*/


//funcionalidad del boton de busqueda
const botonBusqueda = document.getElementById('botonBusqueda');
const textoBuscado = document.getElementById('textoBuscado');
botonBusqueda.addEventListener("click", function() {
  window.location.href = `productos-search.html?busqueda=${textoBuscado.value}`;
})

//funcionalidad de la ventana emergente de mensajes
function mostrarModal(titulo, mensaje, paginaSiguiente = 'javascript:void(0)', idFocus = '') {
  const modal = document.getElementById("modalMensaje");
  const tituloModal = document.getElementById("modal-titulo");
  const mensajeModal = document.getElementById("modal-info");
  const closeBtn = modal.querySelector(".modal-close");

  tituloModal.textContent = titulo;
  mensajeModal.innerHTML = mensaje;

  modal.style.display = "flex";

  closeBtn.onclick = () => {
    modal.style.display = "none";
    window.location.href = paginaSiguiente;
    document.getElementById(idFocus).focus();
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      window.location.href = paginaSiguiente;
      document.getElementById(idFocus).focus();    
    }
  };
}


//notificaciones
function mostrarNotificacion(mensaje) {
  const notificaciones = document.getElementById("notificaciones");

  const notif = document.createElement("div");
  notif.classList.add("notificacion");
  notif.innerHTML = mensaje;

  notificaciones.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("mostrar");
  }, 100);

  setTimeout(() => {
    notif.classList.remove("mostrar");
    setTimeout(() => {
      notif.remove();
    }, 500);
  }, 3000);
}


function notificacionCarrito(){
  mostrarNotificacion(`<i class='bi bi-check-circle'></i> Producto agregado al carrito`)
}

//funcionalidad del modal para mostrar datos del usuario
document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "https://backend-proyecto-distribuidora-production.up.railway.app/api/auth";

    const nombreInput = document.getElementById("nombreUsuario");
    const correoInput = document.getElementById("correoUsuario");
    const telefonoInput = document.getElementById("telefonoUsuario");
    const dniInput = document.getElementById("dniUsuario");
    const btnCambiar = document.getElementById("btnCambiarDatos");
    const btnConfirmar = document.getElementById("btnConfirmarCambios");
    const cuerpoModal = document.getElementById("cuerpoModalDatosUsuario");

    const usuario = JSON.parse(localStorage.getItem("usuario")) || [];

    function cargarDatos() {
        nombreInput.value = usuario.nombre;
        correoInput.value = usuario.correo;
        telefonoInput.value = usuario.telefono;
        dniInput.value = usuario.dni;
    }

    cargarDatos();

    btnCambiar.addEventListener("click", () => {
        btnCambiar.disabled = true;
        btnConfirmar.classList.remove("d-none");

        [nombreInput, correoInput, telefonoInput, dniInput].forEach(input => {
        input.removeAttribute("readonly");
        input.classList.add("editable");
        });
    });

    btnConfirmar.addEventListener("click",() => {
        guardarCambios();
    });

    async function guardarCambios() {
        const updatedData = {
        idUsuario: usuario.userId,
        nombre: nombreInput.value.trim(),
        correo: correoInput.value.trim(),
        telefono: telefonoInput.value.trim(),
        dni: dniInput.value.trim()
        };

        //patron para verificar si el campo telefono tiene 9 números
        const regex = /^[0-9]{9}$/;
        if(!regex.test(telefonoInput.value.trim())){
            mostrarModalMensaje("El teléfono nuevo debe tener 9 números.","error");
            return;
        }

        //patron para verificar si el campo dni tiene 8 números
        const regexDni = /^[0-9]{8}$/;
        if(!regexDni.test(dniInput.value.trim())){
            mostrarModalMensaje("El dni ingresado debe tener 8 números.","error");
            return;
        }

        try {
        const res = await fetch(`${API_URL}/actualizar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const text = await res.text(); 
        const respuesta = JSON.parse(text);

        if (res.ok) {
            mostrarModalMensaje(respuesta.mensaje,"success");

            updatedData.userId=updatedData.idUsuario;
            delete updatedData.idUsuario;
            localStorage.setItem("usuario", JSON.stringify(updatedData));

            // Bloquear nuevamente los inputs
            [nombreInput, correoInput, telefonoInput, dniInput].forEach(input => input.setAttribute("readonly", true));
            btnCambiar.disabled = false;
            btnConfirmar.classList.add("d-none");

        } else {
            mostrarModalMensaje(respuesta.mensaje,"error");
        }

        } catch (err) {
        console.error("Error al actualizar usuario:", err);
        alert("Ocurrió un error al actualizar los datos.");
        }
    }

});


// Función para mostrar un modal de mensaje
function mostrarModalMensaje(mensaje, tipo = "info") {

  const modal = document.createElement("div");
  modal.id = "modalMensajePequeño";
  modal.className = "modal fade";
  modal.tabIndex = -1;
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content text-center">
        <div class="modal-header ${
          tipo === "success"
            ? "bg-success text-white"
            : tipo === "error"
            ? "bg-danger text-white"
            : "bg-secondary text-white"
        } p-2">
          <h6 class="modal-title m-0">${
            tipo === "success"
              ? "Éxito"
              : tipo === "error"
              ? "Error"
              : "Aviso"
          }</h6>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body py-3">
          <p class="mb-0">${mensaje}</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const modalBootstrap = new bootstrap.Modal(modal);
  modalBootstrap.show();

  setTimeout(() => {
    modalBootstrap.hide();
    setTimeout(() => modal.remove(), 500);
  }, 3000);
}
