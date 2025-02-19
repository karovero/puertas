require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurar Nodemailer con Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // 🔹 Esto evita el error del certificado
    }
});

// Ruta para enviar pedido
app.post('/enviar_pedido', (req, res) => {
    const { numeroPedido, nombre, email, telefono, carrito } = req.body;

    let productos = "";
    let total = 0;
    carrito.forEach(producto => {
        productos += `- ${producto.nombre}: $${producto.precio}\n`;
        total += producto.precio;
    });

    const mensaje = `Hola ${nombre},\n\nTu pedido ha sido confirmado con el número: ${numeroPedido}\n\nDetalles del pedido:\n${productos}\nTotal: $${total}\n\nGracias por tu compra.`;

    const mailOptionsCliente = {
        from: process.env.EMAIL_USER,
        to: email, // 📩 El cliente recibe este correo
        subject: `Confirmación de Pedido #${numeroPedido}`,
        text: mensaje
    };

    const mailOptionsVendedor = {
        from: process.env.EMAIL_USER,
        to: process.env.VENDEDOR_EMAIL, // 📩 El vendedor recibe este correo
        subject: `Nuevo Pedido #${numeroPedido}`,
        text: mensaje
    };

    // Enviar correo al cliente primero
    transporter.sendMail(mailOptionsCliente, (error, info) => {
        if (error) {
            console.error("❌ Error enviando correo al cliente:", error);
            return res.status(500).send("Error enviando correo al cliente: " + error.toString());
        }
        console.log("📩 Correo enviado al cliente correctamente: " + info.response);

        // Luego enviar el correo al vendedor
        transporter.sendMail(mailOptionsVendedor, (error, info) => {
            if (error) {
                console.error("❌ Error enviando correo al vendedor:", error);
                return res.status(500).send("Error enviando correo al vendedor: " + error.toString());
            }
            console.log("📩 Correo enviado al vendedor correctamente: " + info.response);
            res.send("✅ Correos enviados correctamente.");
        });
    });
});

// Ruta de prueba para verificar envío de correos manualmente
app.get("/test-email", (req, res) => {
    const testMailOptions = {
        from: process.env.EMAIL_USER,
        to: "tuemail@gmail.com", // 📌 Cambia esto por tu correo de prueba
        subject: "Prueba de correo desde Node.js",
        text: "Este es un correo de prueba enviado desde el servidor con Node.js y Nodemailer."
    };

    transporter.sendMail(testMailOptions, (error, info) => {
        if (error) {
            console.error("❌ Error enviando correo:", error);
            return res.status(500).send("Error enviando correo: " + error.toString());
        }
        console.log("📩 Correo enviado correctamente: " + info.response);
        res.send("✅ Correo enviado correctamente: " + info.response);
    });
});

// Ruta principal
app.get("/", (req, res) => {
    res.send("🚀 Servidor funcionando correctamente.");
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("🔥 Servidor corriendo en http://localhost:3000");
});