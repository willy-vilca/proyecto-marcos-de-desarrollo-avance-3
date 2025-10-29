//funciones para guardar los productos agregados al carrito en el localStorage
function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function saveCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


function agregarAlCarrito(producto, cantidad = 1) {
  let carrito = getCarrito();

  // Verificar si ya existe en el carrito
  let existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad
    });
  }

  saveCarrito(carrito);
}


document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "https://backend-proyecto-distribuidora-production.up.railway.app/api";
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const detalleContainer = document.getElementById("product-detail");
    const containerProductosRelacionados = document.querySelector("#seccion-productos .row");

    if (!id) {
        detalleContainer.innerHTML = `<p class="text-center text-danger">No se especificó el producto.</p>`;
        return;
    }

  // Función para armar URL de imagen
  function getImageUrl(productId) {
    return `https://backend-proyecto-distribuidora-production.up.railway.app/images/productos/${productId}.jpg`;
  }

  async function CargarProducto() {
    try {
      const res = await fetch(`${API_BASE}/productos/${id}`);
      if (!res.ok) throw new Error("Error cargando producto");
      const producto = await res.json();

      // cargar detalle del producto
      detalleContainer.innerHTML = `
        <div class="col-md-4 bg-white">
          <img src="${getImageUrl(producto.nombre)}" alt="${producto.nombre}" 
               class="img-fluid rounded shadow" style="width: 500px; height: 350px; object-fit: contain;"
               onerror="this.onerror=null; this.src='https://backend-proyecto-distribuidora-production.up.railway.app/images/default.jpg';">
        </div>
        <div class="col-md-6 mt-4 mt-md-0">
          <h3 class="fw-bold text-danger">${producto.nombre}</h3>
          <p class="fs-4">${producto.descripcion}</p>
          <ul>
            <li class="fs-5"><strong>Código:</strong><span class="text-danger fw-bold"> ${producto.cod}</span></li>
            <li class="fs-5"><strong>Presentación:</strong> Unidad</li>
            <li class="fs-5"><strong>Precio:</strong> S/.${parseFloat(producto.precio).toFixed(2)}</li>
          </ul>
          <button class="btn btn-outline-danger w-100 backgroundHover-rojo mt-3" id="botonAgregarCarrito" onclick="notificacionCarrito()">Agregar al Carrito</button>
        </div>
      `;

      // evento para el botón "Agregar al carrito"
      const btn = document.getElementById('botonAgregarCarrito');

      btn.addEventListener("click", () => {
        agregarAlCarrito(producto);
      });

      //cargar productos relacionados
      CargarProductosRelacionados(producto.subcategoriaId, producto.id);

    } catch (err) {
      console.error(err);
      detalleContainer.innerHTML = `<p class="text-center text-danger">Error cargando producto.</p>`;
    }
  }

  async function CargarProductosRelacionados(idSubcategoria, idProductoActual) {
    try {
      const res = await fetch(`${API_BASE}/productos/subcategoria/${idSubcategoria}`);
      if (!res.ok) throw new Error("Error cargando relacionados");
      let productos = await res.json();

      productos = productos.filter(p => p.id !== parseInt(idProductoActual));
      productos = productos.slice(0, 4);

      containerProductosRelacionados.innerHTML = "";
      if (productos.length === 0) {
        containerProductosRelacionados.innerHTML = "<p class='text-center'>No hay productos relacionados.</p>";
        return;
      }

      productos.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-3";

        col.innerHTML = `
            <div class="product-card shadow">
            <a href="producto-info.html?id=${p.id}">
                <img src="${getImageUrl(p.nombre)}" alt="${p.nombre}"
                onerror="this.onerror=null; this.src='https://backend-proyecto-distribuidora-production.up.railway.app/images/default.jpg';">
            </a>
            <h6 class="mt-2 fw-bold text-danger fs-5">${p.cod}</h6>
            <p class="fs-5">${p.nombre}</p>
            <div class="product-price">S/.${parseFloat(p.precio).toFixed(2)}</div>
            <div class="qty-controls">
                <button class="btn btn-outline-danger btn-sm backgroundHover-rojo" onclick="updateQty(this, -1)">-</button>
                <input type="number" class="form-control mx-1" value="1" min="1">
                <button class="btn btn-outline-danger btn-sm backgroundHover-rojo" onclick="updateQty(this, 1)">+</button>
            </div>
            <button class="btn btn-outline-danger w-100 backgroundHover-rojo btn-add-carrito" onclick="notificacionCarrito()">Agregar al Carrito</button>
            </div>
        `;

        // evento para el botón "Agregar al carrito"
        const btn = col.querySelector(".btn-add-carrito");
        const inputQty = col.querySelector("input");

        btn.addEventListener("click", () => {
            const cantidad = parseInt(inputQty.value) || 1;
            agregarAlCarrito(p, cantidad);
            inputQty.value=1;
        });

        containerProductosRelacionados.appendChild(col);
      });

    } catch (err) {
      console.error("Error cargando relacionados:", err);
      containerProductosRelacionados.innerHTML = `<p class="text-center text-danger">Error cargando productos relacionados.</p>`;
    }
  }

  CargarProducto();
});