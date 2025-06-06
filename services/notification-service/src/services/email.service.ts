// import nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export interface UserRegistrationEmailData {
    name: string;
    email: string;
}

export interface EventRegistrationEmailData {
    userName: string;
    userEmail: string;
    eventTitle: string;
    eventDate: string;
    eventVenue: string;
}

export interface EventCreationEmailData {
    organizerName: string;
    organizerEmail: string;
    eventTitle: string;
    eventDate: string;
    eventVenue: string;
}

export class EmailService {
    // private transporter: nodemailer.Transporter;

    constructor() {
        // this.transporter = nodemailer.createTransporter({
        //     host: process.env.SMTP_HOST || 'smtp.gmail.com',
        //     port: parseInt(process.env.SMTP_PORT || '587'),
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: process.env.SMTP_USER,
        //         pass: process.env.SMTP_PASS,
        //     },
        // });
        console.log("EmailService initialized for demo mode. No real emails will be sent.");
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        console.log('📧 [DEMO] Sending email:');
        console.log(`   From: ${process.env.SMTP_USER || 'demo@orchestrate.com'}`);
        console.log(`   To: ${options.to}`);
        console.log(`   Subject: ${options.subject}`);
        if (options.text) {
            console.log('   Text Body:', options.text.substring(0, 100) + "...");
        }
        if (options.html) {
            console.log('   HTML Body:', options.html.substring(0, 100) + "...");
        }
        console.log('📧 [DEMO] Email "sent" successfully.');
        // try {
        //     const info = await this.transporter.sendMail({
        //         from: process.env.SMTP_USER,
        //         ...options,
        //     });
        //     console.log('📧 Email sent:', info.messageId);
        // } catch (error) {
        //     console.error('❌ Failed to send email:', error);
        //     throw error;
        // }
    }


    async sendWelcomeEmail(data: UserRegistrationEmailData): Promise<void> {
        const emailOptions: EmailOptions = {
            to: data.email,
            subject: '🎉 Welcome to Orchestrate - Your Event Management Platform!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🎭 Welcome to Orchestrate!</h1>
                    </div>
                    
                    <div style="padding: 30px; background-color: #f8f9fa;">
                        <h2 style="color: #333;">Hello ${data.name}! 👋</h2>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Thank you for joining Orchestrate, your comprehensive event management platform! 
                            We're excited to have you on board.
                        </p>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #667eea; margin-top: 0;">🚀 What you can do with Orchestrate:</h3>
                            <ul style="color: #666; line-height: 1.8;">
                                <li><strong>Discover Events:</strong> Browse and register for exciting events</li>
                                <li><strong>Manage Attendance:</strong> Keep track of your event registrations</li>
                                <li><strong>Connect:</strong> Network with other attendees and organizers</li>
                                <li><strong>Stay Updated:</strong> Receive notifications about your events</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #666;">Ready to explore? Start by discovering events in your area!</p>
                        </div>
                        
                        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 20px;">
                            <p style="margin: 0; color: #1976d2; font-size: 14px;">
                                <strong>💡 Tip:</strong> Keep this email for your records. If you have any questions, 
                                feel free to reach out to our support team.
                            </p>
                        </div>
                    </div>
                    
                    <div style="background-color: #333; padding: 20px; text-align: center;">
                        <p style="color: #ccc; margin: 0; font-size: 14px;">
                            © 2025 Orchestrate. Making event management simple and enjoyable.
                        </p>
                    </div>
                </div>
            `,
        };

        await this.sendEmail(emailOptions);
    }

    async sendEventRegistrationEmail(data: EventRegistrationEmailData): Promise<void> {
        const emailOptions: EmailOptions = {
            to: data.userEmail,
            subject: `🎫 Registration Confirmed - ${data.eventTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🎫 Registration Confirmed!</h1>
                    </div>
                    
                    <div style="padding: 30px; background-color: #f8f9fa;">
                        <h2 style="color: #333;">Hello ${data.userName}! 🎉</h2>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Great news! Your registration for the following event has been confirmed:
                        </p>
                        
                        <div style="background-color: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                            <h3 style="color: #4CAF50; margin-top: 0;">📅 Event Details</h3>
                            <table style="width: 100%; color: #666;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event:</strong></td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.eventTitle}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(data.eventDate).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Venue:</strong></td>
                                    <td style="padding: 8px 0;">${data.eventVenue}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                            <h4 style="color: #856404; margin-top: 0;">📝 What's Next?</h4>
                            <ul style="color: #856404; margin: 0;">
                                <li>Add this event to your calendar</li>
                                <li>Arrive 15 minutes early for check-in</li>
                                <li>Bring a valid ID for verification</li>
                                <li>You'll receive a reminder 24 hours before the event</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #666;">We're looking forward to seeing you at the event!</p>
                        </div>
                    </div>
                    
                    <div style="background-color: #333; padding: 20px; text-align: center;">
                        <p style="color: #ccc; margin: 0; font-size: 14px;">
                            © 2025 Orchestrate. Questions? Contact our support team.
                        </p>
                    </div>
                </div>
            `,
        };

        await this.sendEmail(emailOptions);
    }

    async sendEventCreationEmail(data: EventCreationEmailData): Promise<void> {
        const emailOptions: EmailOptions = {
            to: data.organizerEmail,
            subject: `🎊 Event Created Successfully - ${data.eventTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #FF6B6B 0%, #FF5722 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🎊 Event Created Successfully!</h1>
                    </div>
                    
                    <div style="padding: 30px; background-color: #f8f9fa;">
                        <h2 style="color: #333;">Hello ${data.organizerName}! 🎯</h2>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Congratulations! Your event has been successfully created and is now live on Orchestrate:
                        </p>
                        
                        <div style="background-color: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF6B6B;">
                            <h3 style="color: #FF6B6B; margin-top: 0;">🎪 Event Details</h3>
                            <table style="width: 100%; color: #666;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Event:</strong></td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.eventTitle}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(data.eventDate).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;"><strong>Venue:</strong></td>
                                    <td style="padding: 8px 0;">${data.eventVenue}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #17a2b8;">
                            <h4 style="color: #0c5460; margin-top: 0;">🚀 Your Event is Now Live!</h4>
                            <ul style="color: #0c5460; margin: 0;">
                                <li>Attendees can now discover and register for your event</li>
                                <li>You'll receive notifications when people register</li>
                                <li>Monitor your event's performance in your organizer dashboard</li>
                                <li>Edit event details anytime before the event date</li>
                            </ul>
                        </div>
                        
                        <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #dc3545;">
                            <p style="margin: 0; color: #721c24; font-size: 14px;">
                                <strong>📢 Pro Tip:</strong> Share your event details on social media and with your network 
                                to maximize attendance. The more people know about your event, the better!
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #666;">Good luck with your event! We're here to support you every step of the way.</p>
                        </div>
                    </div>
                    
                    <div style="background-color: #333; padding: 20px; text-align: center;">
                        <p style="color: #ccc; margin: 0; font-size: 14px;">
                            © 2025 Orchestrate. Need help? Contact our organizer support team.
                        </p>
                    </div>
                </div>
            `,
        };

        await this.sendEmail(emailOptions);
    }
}


export default function sendDemoEmail(){

    console.log("Sending demo email...");
}

export const emailService = new EmailService();
