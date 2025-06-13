const nodemailer = require("nodemailer");
const path = require("path");

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Leaders-building" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        attachments: [
            {
                filename: "buildingPDF.png",
                path: path.join(__dirname, "src","..",".." ,"Images", "buildingPDF.png"),
                cid: "logo",
            },
        ],
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
