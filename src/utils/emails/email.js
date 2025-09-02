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
    }
    .content {
      font-size: 13px;
      color: #333;
    }
    .otp {
      font-size: 13px;
      font-weight: bold;
      color: rgba(21, 46, 106, 1);
    }
    .footer {
      font-size: 13px;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div>
    <div class="content">
      <p>Hello ${firstName},</p>
      <p>Use the following One-Time Password (OTP) to verify your email address.</p>

      <div class="otp">Your OTP: ${otp}</div>

      <p>Please do not share this code with anyone. This OTP is valid for 5 minutes only.</p>
      <p>If you did not request this code, please ignore this email or contact Wedease support.</p>

    <p>Thank you,<br/>Wedease Team</p>
    <p> © ${new Date().getFullYear()} Wedease. <br/>
      All rights reserved. </p>
    </div>
  </div>
</body>
</html>
`;

  return { subject, body };
};
