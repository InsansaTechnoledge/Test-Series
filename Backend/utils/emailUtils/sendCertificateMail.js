import { getTransporter } from "./emailSetup"

const transporter=getTransporter();

export const sendCertificateMail = async()=>{
    try{
        const mailOptions = {
            from: process.env.EMAIL,
            to: '<recipient_email>',
            subject: 'Your Certificate',
            text: 'Please find your certificate attached.',
            attachments: [
                {
                    filename: 'certificate.pdf',
                    path: '<path_to_certificate>'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
    }catch(error){
        console.error('Error sending certificate email:', error);
    }
}
