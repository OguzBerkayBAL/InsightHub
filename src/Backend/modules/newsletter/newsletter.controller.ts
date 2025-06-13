import { Controller, Post, Body, Param, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { Public } from '../../public.decorator';

@Controller('newsletter')
@Public()
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) { }

    @Post('subscribe')
    @Public()
    async subscribe(@Body() createNewsletterDto: CreateNewsletterDto) {
        try {
            console.log('Received subscription request:', createNewsletterDto);
            return await this.newsletterService.subscribe(createNewsletterDto);
        } catch (error) {
            console.error('Subscription error:', error);

            // If it's already a HttpException, rethrow it
            if (error instanceof HttpException) {
                throw error;
            }

            // Otherwise, wrap it in a generic HTTP exception
            throw new HttpException(
                error.message || 'An error occurred while processing your subscription',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('confirm')
    @Public()
    async confirmSubscription(@Query('token') token: string) {
        console.log(`Newsletter controller received confirmation request with token: ${token ? token.substring(0, 10) + '...' : 'undefined'}`);

        if (!token) {
            console.error('No token provided in the request');
            throw new HttpException('No token provided', HttpStatus.BAD_REQUEST);
        }

        try {
            console.log(`Passing token to service: length ${token.length}`);
            const result = await this.newsletterService.confirmSubscription(token);
            console.log('Confirmation successful, returning response');
            return result;
        } catch (error) {
            console.error('Confirmation error:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                error.message || 'An error occurred while confirming your subscription',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('unsubscribe')
    @Public()
    async unsubscribe(@Query('email') email: string) {
        try {
            return await this.newsletterService.unsubscribe(email);
        } catch (error) {
            console.error('Unsubscribe error:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                error.message || 'An error occurred while unsubscribing',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Test endpoint - Gerçek uygulamada kaldırılabilir
    @Get('test-send/:frequency')
    @Public()
    async testSendNewsletter(@Param('frequency') frequency: string) {
        try {
            if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
                return { error: 'Invalid frequency. Use "daily", "weekly", or "monthly".' };
            }

            // Bu endpoint sadece el ile test için - production'da kullanılmamalı
            await this.newsletterService.sendNewsletter(frequency);
            return { message: `Test ${frequency} newsletter sending initiated.` };
        } catch (error) {
            console.error('Test send error:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                error.message || 'An error occurred while sending test newsletter',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
} 