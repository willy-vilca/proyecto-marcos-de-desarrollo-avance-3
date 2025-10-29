document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "https://backend-proyecto-distribuidora-production.up.railway.app/api";

    const usuarioActual = JSON.parse(localStorage.getItem("usuario")) || [];
    function getImageUrl(producto) {
        return `https://backend-proyecto-distribuidora-production.up.railway.app/images/productos/${producto}.jpg`;
    }

    async function fetchPedidos() {
        try {
        const res = await fetch(`${API_BASE}/pedidos/usuario/${usuarioActual.userId}`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const pedidos = await res.json();
        renderPedidos(pedidos);
        } catch (err) {
        console.error("Error cargando pedidos:", err);
        }
    }

    function renderPedidos(pedidos) {
        const contenedor = document.getElementById("contenedorPedidos");
        contenedor.innerHTML=" ";

        if (pedidos.length === 0) {
        contenedor.innerHTML = "<p class='text-center'>Aún no ha realizado pedidos con este usuario.</p>";
        return;
        }

        pedidos.forEach((p) => {
            const ped = document.createElement("div");
            ped.className = "pedido-card shadow mb-4";

            ped.innerHTML = `
                <div class="pedido-header d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div>
                        <h5 class="fw-bold mb-2 text-danger">Pedido #${p.idPedido}</h5>
                        <p class="mb-1"><strong>Cliente:</strong> ${usuarioActual.nombre}</p>
                        <p class="mb-1"><strong>DNI:</strong> ${usuarioActual.dni}</p>
                        <p class="mb-1"><strong>Correo:</strong> ${usuarioActual.correo}</p>
                    </div>
                    <div class="text-md-end mt-3 mt-md-0">
                        <p class="mb-1"><strong>Fecha:</strong> ${p.fechaPedido}</p>
                        <p class="mb-1"><strong>Total:</strong> S/. ${parseFloat(p.total).toFixed(2)}</p>
                        <button class="btn btn-outline-danger mt-2 toggle-detalles">
                            <i class="bi bi-eye"></i> Ver detalles
                        </button>
                    </div>
                </div>

                <div class="pedido-detalles mt-3" id="${p.idPedido}"></div>
            `

            contenedor.appendChild(ped);
        });

        // Mostrar / ocultar detalles
        document.querySelectorAll('.toggle-detalles').forEach(btn => {
            btn.addEventListener('click', () => {
                const detalles = btn.closest('.pedido-card').querySelector('.pedido-detalles');
                //se comprueba si el contenedor esta vacío, para hacer la petición una única vez.
                if(detalles.childNodes.length < 1){
                    const idPedido = detalles.id;
                    fetchDetallesPedido(idPedido);
                }
                
                detalles.classList.toggle('mostrar');
                btn.innerHTML = detalles.classList.contains('mostrar')
                    ? '<i class="bi bi-eye-slash"></i> Ocultar detalles'
                    : '<i class="bi bi-eye"></i> Ver detalles';
            });
        });
    }


    async function fetchDetallesPedido(idPedido) {
        try {
        const res = await fetch(`${API_BASE}/detalle-pedidos/pedido/${idPedido}`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const detallesPedido = await res.json();
        renderDetallesPedido(detallesPedido,idPedido);
        } catch (err) {
        console.error("Error cargando los detalles del pedido:", err);
        }
    }


    function renderDetallesPedido(detallesPedido,idPedido){
        const contenedor = document.getElementById(idPedido);
        contenedor.innerHTML=" ";

        detallesPedido.forEach((det) => {
            const detalle = document.createElement("div");
            detalle.className = "detalle-item shadow-sm p-3 mb-3 rounded d-flex flex-wrap justify-content-between align-items-center";

            detalle.innerHTML =`
                <div class="d-flex align-items-center">
                    <a href="producto-info.html?id=${det.idProducto}">
                    <img src="${getImageUrl(det.nombreProducto)}" alt="${det.nombreProducto}" class="img-producto-pedido me-3"
                    onerror="this.onerror=null; this.src='https://backend-proyecto-distribuidora-production.up.railway.app/images/default.jpg';">
                    </a>
                    <span class="fw-medium text-truncate nombre-producto ms-0 ms-sm-4"><a href="producto-info.html?id=${det.idProducto}" class="text-dark text-truncate product-name">${det.nombreProducto}</a></span>
                </div>
                <div class="text-start text-sm-end mt-3 mt-sm-0">
                    <p class="mb-1">Cantidad: ${det.cantidad}</p>
                    <p class="mb-0 text-danger fw-bold">Subtotal: S/. ${parseFloat(det.subtotal).toFixed(2)}</p>
                </div>
            `
            contenedor.appendChild(detalle);
        })
    }


    fetchPedidos();
});