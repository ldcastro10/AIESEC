const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-confirmation-email", async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // use SSL
        auth: {
            user: 'luiscastro2000@outlook.com',
            pass: 'Karen123*'
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    const mailOptions = {
        from: "luiscastro2000@outlook.com", // Replace with your Gmail account
        to: "luiscastro2000@outlook.com",
        subject: "Confirmación de acceso",
        text: "Por favor, confirme su acceso haciendo clic en el enlace proporcionado.",
        html: "<a href='http://localhost:3000/productServices'>Confirmar acceso</a>",
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send("Correo de confirmación enviado.");
    } catch (error) {
        console.error("Error al enviar correo de confirmación:", error);
        res.status(500).send("Error al enviar correo de confirmación.");
    }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
