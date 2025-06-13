import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './common/config/swagger/swagger.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3000;

  // Adding the global prefix to match frontend requests
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Tüm origin'lerden gelen istekleri kabul eder
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH', // Kabul edilen HTTP metodları
    allowedHeaders: 'Content-Type, Authorization,Origin,Accept', // Kabul edilen header'lar
    credentials: true,
  });

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`docs`, app, swaggerDocument);

  await app.listen(port); // Portu direkt buraya kullanın
  console.log(`Application is running on: http://localhost:${port}`); // Portu burada yazdırabilirsiniz
}
bootstrap();
