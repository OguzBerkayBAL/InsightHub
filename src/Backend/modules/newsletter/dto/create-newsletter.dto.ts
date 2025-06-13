import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateNewsletterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsEnum(['daily', 'weekly', 'monthly'], {
        message: 'frequency must be one of the following values: daily, weekly, monthly',
    })
    frequency: string;
} 