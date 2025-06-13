import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';

const configService = new ConfigService();
const isDebugMode = configService.get<string>('DEBUG') == 'true' ? true : false;

const swaggerConfigFirst = new DocumentBuilder()
  .setTitle('Bitirme BACKEND API')
  .setDescription('API for Bitirme')
  .setVersion('1.0.1')
  .addBearerAuth(
    {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    },
    'JWT-AUTH',
  );

if (!isDebugMode) {
  swaggerConfigFirst.addSecurityRequirements('JWT-AUTH');
}

export const swaggerConfig = swaggerConfigFirst.build();
