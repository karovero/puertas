const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;  // Usa el puerto de Railway o 3000 por defecto

// Middleware para manejar CORS y parsear el cuerpo de las solicitudes
app.use(cors());
app.use(bodyParser.json());

// Configuración del transporte para Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Correo electrónico del usuario
        pass: process.env.EMAIL_PASS,  // Contraseña de la aplicación (si usas Gmail con 2FA)
    },
    tls: {
        rejectUnauthorized: false,  // Para evitar el error de certificado autofirmado
    },
});

// Ruta de prueba para verificar si el servidor está funcionando
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

// Ruta para recibir pedidos y enviar correos de confirmación
app.post('/enviar_pedido', (req, res) => {
    const { numeroPedido, nombre, email, telefono, carrito } = req.body;

    let productos = '';
    let total = 0;

    // Crear el mensaje con los detalles del pedido
    carrito.forEach(producto => {
        productos += `- ${producto.nombre}: $${producto.precio}\n`;
        total += producto.precio;
    });

    const mensaje = `Hola ${nombre},\n\nTu pedido ha sido confirmado con el número: ${numeroPedido}\n\nDetalles del pedido:\n${productos}\nTotal: $${total}\n\nGracias por tu compra.`;

    // Configuración del correo para el cliente
    const mailOptionsCliente = {
        from: process.env.EMAIL_USER,  // Correo de envío
        to: email,  // Correo del cliente
        subject: `Confirmación de Pedido #${numeroPedido}`,
        text: mensaje,
    };

    // Configuración del correo para el vendedor
    const mailOptionsVendedor = {
        from: process.env.EMAIL_USER,  // Correo de envío
        to: process.env.VENDEDOR_EMAIL,  // Correo del vendedor
        subject: `Nuevo Pedido #${numeroPedido}`,
        text: mensaje,
    };

    // Enviar correo al cliente
    transporter.sendMail(mailOptionsCliente, (error, info) => {
        if (error) {
            console.error('❌ Error enviando correo:', error);
            return res.status(500).send('Error enviando correo: ' + error.toString());
        }

        // Enviar correo al vendedor
        transporter.sendMail(mailOptionsVendedor, (error, info) => {
            if (error) {
                console.error('❌ Error enviando correo al vendedor:', error);
                return res.status(500).send('Error enviando correo al vendedor: ' + error.toString());
            }
            console.log('📩 Correo enviado correctamente:', info.response);
            res.send('✅ Correo enviado correctamente: ' + info.response);
        });
    });
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
