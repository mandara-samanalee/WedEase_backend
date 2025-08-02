import nodemailer from 'nodemailer';

class MailService {
    constructor(recipient, subject, body, /* attachments = [] */) {
        this.mailDetails = {
            from: process.env.EMAIL_USER,
            to: recipient,
            subject,
            html: body,
            //attachments,
        };

        this.mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendEmail() {
        try {
            const result = await this.mailTransporter.sendMail(this.mailDetails);
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
    }
};

export default MailService;
