import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MailerService {
  private resendApiUrl = 'https://api.resend.com/emails'; // Resend API endpoint
  private apiKey = 're_fexEwuNz_9cYafo1Qdk9SyJqoRMn2a9xi';  // Replace with your Resend API key

  async sendMail(to: string, subject: string, body: string) {
    const data = {
      from: 'moneyMap.com',  // Your sender email (use your Resend-provided sender)
      to: to,  // Recipient email
      subject: subject,
      html: `<p>${body}</p>`,  // HTML formatted email body
    };

    try {
      const response = await axios.post(this.resendApiUrl, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
    }
  }
}
