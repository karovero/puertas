// --- CALCULADORA DE PRECIOS ---
function calcularPrecio() {
    let puerta = document.getElementById("puerta").value;
    let estado = document.getElementById("estado").value;

    // Precios base de las puertas
    let precioBase = puerta === "puerta1" ? 100 : 200;

    // Costo de envío según estado
    let envio = (estado === "estado1") ? 50 : 100;

    // Calcular el total
    let total = precioBase + envio;

    document.getElementById("resultado").innerText = "El precio total es: $" + total;
}

// --- CARRITO DE COMPRAS ---
let carrito = [];

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarrito();
}

function actualizarCarrito() {
    let carritoHTML = document.getElementById("carrito");
    carritoHTML.innerHTML = "<h2>Carrito de Compras</h2>";

    let total = 0;
    carrito.forEach((producto, index) => {
        total += producto.precio;
        carritoHTML.innerHTML += `<p>${producto.nombre} - $${producto.precio} 
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button></p>`;
    });

    carritoHTML.innerHTML += `<h3>Total: $${total}</h3>`;
    carritoHTML.innerHTML += `<button onclick="finalizarCompra()">Finalizar Compra</button>`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.location.href = "checkout.html";
}