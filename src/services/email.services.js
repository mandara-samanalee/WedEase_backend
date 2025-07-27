import { nodemailer } from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


transporter.verify((error, success) => {
    if (error) {
        console.error('Error verifying email transporter:', error);
    } else {
        console.log('Email transporter is ready to send messages');
    }
});


const sendEmail = async ({ to, subject, body }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: body,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        if (result.accepted && result.accepted.length > 0) {
            return {
                status: 202,
                success: true,
                message: 'Email sent successfully',
                info: result,
            };
        } else {
            return {
                status: 406,
                success: false,
                message: 'Email not sent',
            };
        }
    } catch (error) {
        return {            
            status: 500,
            success: false,
            message: 'Error sending email',
            error: error.message || 'Unknown error',
        };
    }
};

export default sendEmail;
