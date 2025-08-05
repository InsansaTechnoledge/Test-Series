import nodemailer from 'nodemailer';

let transporter=null;

export const getTransporter = ()=>{
    if(!transporter){
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.PASSWORD, 
            },
        });

        transporter.verify((error, success) => {
            if (error) {
                console.error('Error verifying email transporter:', error);
            } else {
                console.log('Email transporter is ready to send emails.');
            }
        });
    }
    
    return transporter;
}


