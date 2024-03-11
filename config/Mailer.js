import nodemailer from 'nodemailer';

export const verifyGmail = (email , resetLink , subject , message) => {
   console.log("Enters email");
   const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.PASSWORD,
     },
   });

   var mailOptions = {
     from: "noreply@hello.com",
     to: email,
     subject: subject,
     text: `${message}: ${resetLink}`,
   };

   transporter.sendMail(mailOptions, function (error, info) {
     if (error) {
       console.log(error);
       return next(
         new HttpError(`Error sending reset email. Please try again.`, 500)
       );
     } else {
       console.log("Email sent: " + info.response);
       res
         .status(200)
         .json("Please check your email for password reset instructions");
     }
   });
}