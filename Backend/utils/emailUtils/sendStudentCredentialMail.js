import { getTransporter } from "./emailSetup.js";

const transporter = getTransporter();

export const sendStudentCredentialsMail = async (orgName, studentName, email, password) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Your ${orgName} Student Account Credentials - EvalvoTech`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f6f8; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <div style="background-color: #1a73e8; padding: 20px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">EvalvoTech</h1>
                    <p style="margin: 0; font-size: 14px;">Learning Access for ${orgName}</p>
                </div>
                <div style="padding: 30px;">
                    <p>Dear <strong>${studentName}</strong>,</p>
                    <p>Welcome to <strong>${orgName}</strong>! You have been registered as a student on our EvalvoTech platform.</p>
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
                    <p style="color: red; font-weight: bold; font-size: 14px;">
                        ⚠ Do not share these credentials with anyone. For any queries or login issues, please contact your organization directly.
                    </p>
                    <p style="font-size: 14px; color: #555;">For your security, we recommend changing your password immediately after logging in.</p>
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
        console.log("Student credentials email sent successfully");
    } catch (error) {
        console.error("Error sending student credentials email:", error);
    }
};
