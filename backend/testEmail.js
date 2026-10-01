require("dotenv").config();

const transporter =
  require("./src/config/mailer");

const sendTestEmail =
  async () => {

    try {

      const info =
        await transporter.sendMail({

          from:
            `"PriceLens Test" <${process.env.EMAIL_USER}>`,

          to:
            "nobinkumar99@gmail.com",

          subject:
            "PriceLens Email Test",

          html: `
            <h2>PriceLens Email Test ✅</h2>

            <p>
              If you received this email,
              Gmail SMTP is working correctly.
            </p>
          `,
        });


      console.log(
        "================================="
      );

      console.log(
        "TEST EMAIL SENT SUCCESSFULLY"
      );

      console.log(
        "Message ID:",
        info.messageId
      );

      console.log(
        "================================="
      );

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "TEST EMAIL FAILED"
      );

      console.error(
        error
      );

      console.error(
        "================================="
      );
    }
  };


sendTestEmail();