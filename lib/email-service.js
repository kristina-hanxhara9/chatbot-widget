import { format } from 'date-fns';

// This is a placeholder email service - in production, 
// you would use a real email service like SendGrid or Amazon SES
export async function sendAppointmentConfirmation({ to, appointment, business, service }) {
  console.log(`Sending appointment confirmation to ${to}`);
  
  // In a real implementation, you'd use a service like this:
  /*
  const mailOptions = {
    from: `${business.name} <noreply@yourdomain.com>`,
    to,
    subject: `Appointment Confirmation - ${business.name}`,
    html: generateEmailTemplate({
      appointment,
      business,
      service
    })
  };
  
  await transporter.sendMail(mailOptions);
  */
  
  // For demonstration, just return success
  return { success: true };
}

export async function sendAppointmentReminder({ to, appointment, business, service }) {
  console.log(`Sending appointment reminder to ${to}`);
  
  // Similar to confirmation, but with reminder messaging
  return { success: true };
}

// Helper function to generate the email template
function generateEmailTemplate({ appointment, business, service }) {
  const appointmentDate = format(new Date(appointment.date), 'EEEE, MMMM d, yyyy');
  const appointmentTime = format(new Date(appointment.date), 'h:mm a');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Appointment Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: #4f46e5;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .appointment-details {
          background-color: #f9fafb;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${business.name}</h1>
        <p>Appointment Confirmation</p>
      </div>
      
      <div class="content">
        <p>Hello ${appointment.customerName},</p>
        
        <p>Your appointment has been confirmed. Here are the details:</p>
        
        <div class="appointment-details">
          <p><strong>Service:</strong> ${service.name}</p>
          <p><strong>Date:</strong> ${appointmentDate}</p>
          <p><strong>Time:</strong> ${appointmentTime}</p>
          <p><strong>Duration:</strong> ${service.duration} minutes</p>
          <p><strong>Location:</strong> ${business.location}</p>
        </div>
        
        <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
        
        <a href="#" class="button">Manage Your Appointment</a>
      </div>
      
      <div class="footer">
        <p>${business.name} | ${business.location}</p>
        <p>${business.hours}</p>
        <p>&copy; ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}