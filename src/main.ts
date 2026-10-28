import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('FleetCore API')
    .setDescription('Sistema de gestión de mantenimiento de vehículos FleetCore - M6.2')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`FleetCore corriendo en: ${await app.getUrl()}/api`);
  console.log(`Swagger Docs disponibles en: ${await app.getUrl()}/api/docs`);
}
void bootstrap().catch((error: unknown) => {
  console.error('No se pudo iniciar FleetCore:', error);
  process.exitCode = 1;
});