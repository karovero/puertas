document.addEventListener("DOMContentLoaded", function() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    document.getElementById("checkout-form").addEventListener("submit", function(event) {
        event.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let email = document.getElementById("email").value;
        let telefono = document.getElementById("telefono").value;

        let numeroPedido = "PED-" + Date.now();
        let mensajePedido = `Tu orden es el número: ${numeroPedido}`;

        document.getElementById("mensaje").innerText = mensajePedido;

        fetch("http://localhost:3000/enviar_pedido", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                numeroPedido,
                nombre,
                email,
                telefono,
                carrito
            })
        });

        localStorage.removeItem("carrito");
    });
});