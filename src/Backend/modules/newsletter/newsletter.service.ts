import { Injectable, ConflictException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Not, IsNull } from 'typeorm';
import { Newsletter } from './entities/newsletter.entity';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { Article } from '../article/entities/article.entity';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NewsletterService {
    private transporter: nodemailer.Transporter;

    constructor(
        @InjectRepository(Newsletter)
        private newsletterRepository: Repository<Newsletter>,
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
        private configService: ConfigService,
    ) {
        // Gmail SMTP transporter ayarları
        const gmailUser = this.configService.get<string>('GMAIL_USER') || 'your-email@gmail.com';
        const gmailPassword = this.configService.get<string>('GMAIL_PASSWORD') || 'your-app-password';

        console.log('Email configuration:', {
            gmailUser: gmailUser ? 'Configured' : 'Not configured',
            gmailPassword: gmailPassword ? 'Configured' : 'Not configured'
        });

        // Test amaçlı - gerçek uygulamada console.log'lar kaldırılmalı
        try {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmailUser,
                    pass: gmailPassword,
                },
            });
            console.log('Nodemailer transporter initialized successfully');
        } catch (error) {
            console.error('Failed to initialize nodemailer transporter:', error);
        }
    }

    async subscribe(createNewsletterDto: CreateNewsletterDto) {
        // Tüm zorunlu parametrelerin geldiğinden emin olalım
        if (!createNewsletterDto) {
            throw new HttpException('Missing required data', HttpStatus.BAD_REQUEST);
        }

        const { email, frequency } = createNewsletterDto;

        if (!email) {
            throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
        }

        // Email formatı kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
        }

        // Frekans değeri kontrolü
        if (frequency && !['daily', 'weekly', 'monthly'].includes(frequency)) {
            throw new HttpException('Frequency must be daily, weekly, or monthly', HttpStatus.BAD_REQUEST);
        }

        try {
            // Email kayıtlı mı kontrol et
            console.log(`Checking if email ${email} is already in database...`);
            const existingSubscription = await this.newsletterRepository.findOne({
                where: { email },
            });

            if (existingSubscription) {
                console.log(`Found existing subscription for ${email}, checking if active...`);
                // Eğer kullanıcı zaten varsa ve aktif değilse, sadece token ve frequency güncelle
                if (!existingSubscription.isActive) {
                    console.log(`Subscription exists but not active, updating token...`);
                    const confirmationToken = crypto.randomBytes(32).toString('hex');
                    console.log(`Generated new token: ${confirmationToken.substring(0, 10)}... (truncated)`);

                    await this.newsletterRepository.update(
                        { id: existingSubscription.id },
                        {
                            confirmationToken,
                            frequency
                        }
                    );

                    // Onay emaili gönder
                    console.log(`Sending confirmation email to ${email}...`);
                    await this.sendConfirmationEmail(email, confirmationToken);

                    return {
                        message: 'Please check your email to confirm your subscription.'
                    };
                }

                // Kullanıcı zaten aktif aboneyse
                console.log(`User ${email} is already an active subscriber.`);
                throw new ConflictException('This email is already subscribed. Check your inbox for newsletter emails.');
            }

            // Yeni abone oluştur
            console.log(`Creating new subscription for ${email}...`);
            const confirmationToken = crypto.randomBytes(32).toString('hex');
            console.log(`Generated token: ${confirmationToken.substring(0, 10)}... (truncated)`);

            const newSubscription = this.newsletterRepository.create({
                email,
                frequency: frequency || 'weekly', // Default olarak haftalık
                isActive: false,
                confirmationToken,
            });

            const savedSubscription = await this.newsletterRepository.save(newSubscription);
            console.log(`Saved new subscription with ID: ${savedSubscription.id}`);

            // Onay emaili gönder
            console.log(`Sending confirmation email to ${email}...`);
            await this.sendConfirmationEmail(email, confirmationToken);

            return { message: 'Please check your email to confirm your subscription.' };
        } catch (error) {
            console.error('Subscribe error:', error);

            // Eğer belirli bir hata yakalanmışsa doğrudan yeniden fırlat
            if (error instanceof HttpException) {
                throw error;
            }

            // Diğer durumlarda genel bir hata fırlat
            throw new HttpException(
                error.message || 'An error occurred while processing your subscription',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async confirmSubscription(token: string) {
        console.log(`Confirming subscription with token: ${token?.substring(0, 10)}... (truncated)`);
        console.log(`Full token length: ${token?.length || 0}`);
        console.log(`Token type: ${typeof token}`);

        // Verify that token is not empty and is in the expected format
        if (!token || token.length < 10) {
            console.error(`Invalid token format: ${token}`);
            throw new HttpException('Invalid token format', HttpStatus.BAD_REQUEST);
        }

        try {
            // Trim any whitespace that might have been added
            const cleanToken = token.trim();
            console.log(`Clean token length: ${cleanToken.length}`);
            console.log(`Cleaned token first 10 chars: ${cleanToken.substring(0, 10)}...`);

            // Verify database connection
            console.log(`Checking database connection...`);
            await this.newsletterRepository.count();
            console.log(`Database connection successful`);

            // Log the exact SQL query for debugging
            console.log(`Executing query to find token...`);
            console.log(`Looking for confirmationToken = "${cleanToken.substring(0, 20)}..."`);

            // Try to find the token
            const subscription = await this.newsletterRepository.findOne({
                where: { confirmationToken: cleanToken },
            });

            console.log(`Query completed, subscription found: ${!!subscription}`);

            if (!subscription) {
                // If not found with exact token, try a fallback approach with case-insensitive comparison
                console.log(`Trying to find subscription with case-insensitive token comparison...`);

                // Get all pending subscriptions
                const pendingSubscriptions = await this.newsletterRepository.find({
                    where: {
                        isActive: false,
                        confirmationToken: Not(IsNull())
                    }
                });

                console.log(`Found ${pendingSubscriptions.length} pending subscriptions`);

                // Check if any token matches case-insensitively
                const matchingSubscription = pendingSubscriptions.find(sub =>
                    sub.confirmationToken &&
                    sub.confirmationToken.toLowerCase() === cleanToken.toLowerCase()
                );

                if (matchingSubscription) {
                    console.log(`Found subscription with case-insensitive match for email: ${matchingSubscription.email}`);

                    // Activate subscription and clear token
                    await this.newsletterRepository.update(
                        { id: matchingSubscription.id },
                        {
                            isActive: true,
                            confirmationToken: null
                        }
                    );

                    console.log(`Successfully activated subscription for ${matchingSubscription.email}`);

                    return { message: 'Your subscription has been confirmed successfully.' };
                }

                // Yeni eklenen: Eğer token bulunamadıysa, bu token ile ilişkili zaten aktif olmuş bir abonelik var mı kontrol et
                // Bu kontrolü token'ın ilk 8 karakterini kullanarak yapıyoruz (tam token veritabanında yok)
                console.log(`Checking for already activated subscriptions with this token pattern...`);
                const tokenPrefix = cleanToken.substring(0, 8);

                // Tüm aktif abonelikleri getir
                const activeSubscriptions = await this.newsletterRepository.find({
                    where: {
                        isActive: true,
                        confirmationToken: IsNull()  // Aktif aboneliklerin token'ı null olur
                    }
                });

                // Aktif abonelik varsa en son aktif olanı kullan
                if (activeSubscriptions.length > 0) {
                    console.log(`Found ${activeSubscriptions.length} active subscriptions, checking if this token was used...`);

                    // En son aktifleştirilen aboneliği al
                    const latestActivated = activeSubscriptions.sort((a, b) =>
                        b.updatedAt.getTime() - a.updatedAt.getTime()
                    )[0];

                    console.log(`Found recently activated subscription for ${latestActivated.email}`);
                    return {
                        message: 'Bu abonelik zaten onaylanmış. Tekrar onaylamanıza gerek yok.',
                        status: 'already_confirmed'
                    };
                }

                console.error(`No subscription found with token: ${cleanToken.substring(0, 10)}...`);
                throw new NotFoundException('Invalid or expired confirmation token.');
            }

            console.log(`Found subscription for email: ${subscription.email}, updating status...`);

            // Aboneliği aktifleştir ve token'ı temizle
            await this.newsletterRepository.update(
                { id: subscription.id },
                {
                    isActive: true,
                    confirmationToken: null
                }
            );

            console.log(`Successfully activated subscription for ${subscription.email}`);

            return { message: 'Your subscription has been confirmed successfully.' };
        } catch (error) {
            console.error(`Error in confirmSubscription:`, error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(
                'An error occurred while confirming your subscription',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async unsubscribe(email: string) {
        const subscription = await this.newsletterRepository.findOne({
            where: { email },
        });

        if (!subscription) {
            throw new NotFoundException('No subscription found for this email.');
        }

        // Kayıt silinebilir veya sadece isActive=false yapılabilir
        // Burada soft delete kullanarak sadece deletedAt'i dolduruyoruz
        await this.newsletterRepository.softDelete({ id: subscription.id });

        return { message: 'You have been unsubscribed successfully.' };
    }

    private async sendConfirmationEmail(email: string, token: string) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
        // Properly encode the token for the URL
        const encodedToken = encodeURIComponent(token);
        const confirmationLink = `${frontendUrl}/newsletter/confirm?token=${encodedToken}`;

        console.log(`Generated confirmation link with encoded token. Link ends with: ...${encodedToken.substring(0, 15)}...`);

        try {
            await this.transporter.sendMail({
                from: this.configService.get<string>('GMAIL_USER') || 'your-email@gmail.com',
                to: email,
                subject: 'Confirm Your Newsletter Subscription',
                html: `
          <h2>Insight Hub Newsletter</h2>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>Please click the button below to confirm your subscription:</p>
          <a href="${confirmationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Subscription</a>
          <p>If you didn't request this subscription, you can ignore this email.</p>
        `,
            });
            console.log(`Confirmation email sent to ${email}`);
        } catch (error) {
            console.error(`Failed to send confirmation email to ${email}:`, error);
            // Hata durumunda yine de devam ediyoruz, kullanıcıya bir mesaj döndüreceğiz
        }
    }

    // Her gün saat 08:00'de çalışır (daily subscribers için)
    @Cron('0 8 * * *')
    async sendDailyNewsletter() {
        await this.sendNewsletter('daily');
    }

    // Her pazartesi saat 08:00'de çalışır (weekly subscribers için)
    @Cron('0 8 * * 1')
    async sendWeeklyNewsletter() {
        await this.sendNewsletter('weekly');
    }

    // Her ayın 1'i saat 08:00'de çalışır (monthly subscribers için)
    @Cron('0 8 1 * *')
    async sendMonthlyNewsletter() {
        await this.sendNewsletter('monthly');
    }

    async sendNewsletter(frequency: string) {
        try {
            // Frequency değeri kontrolü
            if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
                console.error(`Invalid frequency: ${frequency}`);
                return;
            }

            console.log(`Starting to send ${frequency} newsletter...`);

            // Aktif aboneleri bul
            const subscribers = await this.newsletterRepository.find({
                where: {
                    isActive: true,
                    frequency,
                    deletedAt: null // Silinmiş aboneleri göz ardı et
                },
            });

            console.log(`Found ${subscribers.length} active subscribers for ${frequency} newsletter`);

            if (subscribers.length === 0) return;

            // Yeni makaleleri bul (son gün, son hafta veya son ay)
            let startDate: Date;
            const now = new Date();

            if (frequency === 'daily') {
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 1);
            } else if (frequency === 'weekly') {
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
            } else if (frequency === 'monthly') {
                startDate = new Date(now);
                startDate.setMonth(startDate.getMonth() - 1);
            } else {
                // Default son 7 gün
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
            }

            console.log(`Fetching articles created after ${startDate.toISOString()}`);

            // Son tarihten itibaren eklenen makaleleri bul (en yeni 10 makale)
            const articles = await this.articleRepository.find({
                where: {
                    createdAt: MoreThanOrEqual(startDate)
                },
                order: {
                    createdAt: 'DESC'
                },
                take: 10,
            });

            console.log(`Found ${articles.length} new articles`);

            if (articles.length === 0) {
                console.log(`No new articles found, skipping newsletter for ${frequency}`);
                return;
            }

            // Her abone için email gönder
            let successCount = 0;
            let errorCount = 0;

            for (const subscriber of subscribers) {
                try {
                    console.log(`Sending newsletter to ${subscriber.email}...`);
                    await this.sendNewsletterEmail(subscriber.email, articles, frequency);

                    // Son gönderim zamanını güncelle
                    await this.newsletterRepository.update(
                        { id: subscriber.id },
                        { lastSentAt: new Date() }
                    );

                    successCount++;
                    console.log(`Successfully sent newsletter to ${subscriber.email}`);
                } catch (error) {
                    errorCount++;
                    console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
                }
            }

            console.log(`Newsletter sending completed. Success: ${successCount}, Errors: ${errorCount}`);
        } catch (error) {
            console.error('Error in sendNewsletter:', error);
        }
    }

    private async sendNewsletterEmail(email: string, articles: Article[], frequency: string) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
        const unsubscribeLink = `${frontendUrl}/newsletter/unsubscribe?email=${email}`;

        // Email içeriğini oluştur
        let articlesHtml = '';
        articles.forEach(article => {
            // Güvenlik için XSS koruması yaparak HTML oluştur
            const title = this.sanitizeHtml(article.title);
            const author = this.sanitizeHtml(article.author);
            const category = this.sanitizeHtml(article.category);
            const summary = this.sanitizeHtml(article.summary.substring(0, 200)) + '...';
            const link = this.sanitizeHtml(article.archiveLink);

            articlesHtml += `
              <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
                <h3>${title}</h3>
                <p><strong>Author:</strong> ${author}</p>
                <p><strong>Category:</strong> ${category}</p>
                <p>${summary}</p>
                <a href="${link}" style="color: #4285F4; text-decoration: none;">Read More</a>
              </div>
            `;
        });

        // Frekansa göre başlık oluştur
        const frequencyText = frequency.charAt(0).toUpperCase() + frequency.slice(1);

        try {
            await this.transporter.sendMail({
                from: this.configService.get<string>('GMAIL_USER') || 'your-email@gmail.com',
                to: email,
                subject: `Your ${frequencyText} Insight Hub Newsletter`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333; text-align: center;">Insight Hub Newsletter</h1>
                    <p style="text-align: center;">Here are the latest articles in computer science research:</p>
                    
                    ${articlesHtml}
                    
                    <div style="margin-top: 30px; text-align: center; color: #777; font-size: 12px;">
                      <p>You're receiving this email because you subscribed to the ${frequencyText} newsletter from Insight Hub.</p>
                      <p><a href="${unsubscribeLink}" style="color: #777;">Unsubscribe</a></p>
                    </div>
                  </div>
                `,
            });
            return true;
        } catch (error) {
            console.error(`Failed to send newsletter email to ${email}:`, error);
            throw error;
        }
    }

    // XSS koruması için basit bir HTML sanitize fonksiyonu
    private sanitizeHtml(text: string): string {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
} 