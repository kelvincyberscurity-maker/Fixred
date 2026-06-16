import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const apiKey = req.headers["x-api-key"];

    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        success: false,
        message: "Invalid API Key"
      });
    }

    const {
      to_email,
      subject,
      body,
      sender_user,
      sender_pass,
      number,
      user_id,
      username
    } = req.body;

    if (
      !to_email ||
      !subject ||
      !body ||
      !sender_user ||
      !sender_pass
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender_user,
        pass: sender_pass
      }
    });

    const info = await transporter.sendMail({
      from: `"Appeal Service" <${sender_user}>`,
      to: to_email,
      subject,
      html: body
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
      target: number || null,
      user_id: user_id || null,
      username: username || null
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
