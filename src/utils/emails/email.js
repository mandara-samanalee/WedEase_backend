export const sendOtpEmail = (otp, firstName) => {
  const subject = "Wedease OTP Verification";

  const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .content {
      font-size: 16px;
      color: #333;
      line-height: 1.6;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      background: #f2f2f2;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      letter-spacing: 5px;
      color: #dc16b8ff;
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #aaa;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Hello ${firstName},</p>
      <p>Use the following One-Time Password (OTP) to verify your email address.</p>

      <div class="otp">Your OTP: ${otp}</div>

      <p>Please do not share this code with anyone. This OTP is valid for 5 minutes only.</p>
      <p>If you did not request this code, please ignore this email or contact Wedease support.</p>

    <p>Thank you,<br/>Wedease Team</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Wedease. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

  return { subject, body };
};
