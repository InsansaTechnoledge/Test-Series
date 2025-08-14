import { getTransporter } from "./emailSetup.js";

const transporter = getTransporter();

export const sendUserCredentialsMail = async (orgName = '1234', userName, email, password, role) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Your ${orgName} Account Credentials - EvalvoTech`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f6f8; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <div style="background-color: #1a73e8; padding: 20px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">EvalvoTech</h1>
                    <p style="margin: 0; font-size: 14px;">Empowering Assessments for ${orgName}</p>
                </div>
                <div style="padding: 30px;">
                    <p>Dear <strong>${userName}</strong>,</p>
                    <p>You have been assigned the role of <strong>${role}</strong> in <strong>${orgName}</strong> via our EvalvoTech platform.</p>
                    <p>Here are your login credentials:</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                        <tr>
                            <td style="padding: 8px; background: #f4f4f4; border: 1px solid #ddd;"><strong>Email:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; background: #f4f4f4; border: 1px solid #ddd;"><strong>Password:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
                        </tr>
                    </table>
                    <p>Please sign in to your account using the credentials above:</p>
                    <p style="text-align: center;">
                        <a href="https://evalvotech.com/login" style="background-color: #1a73e8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Sign In Now
                        </a>
                    </p>
                    <div style="font-size: 10px; color: #555; margin-top: 30px; text-align: center; font-style: italic;">
  Note: These credentials are issued to the recipient mentioned above. Do not share this document with anyone.  
  For any queries, please contact your organization.
</div>
                    <p>Best regards,<br>
                    <strong>EvalvoTech Team</strong></p>
                </div>
                <div style="background: #f4f6f8; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    &copy; ${new Date().getFullYear()} EvalvoTech. All rights reserved.
                </div>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Credentials email sent successfully");
    } catch (error) {
        console.error("Error sending credentials email:", error);
    }
};

