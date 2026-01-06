import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// root file -> entry point of my nest js application

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //global settings
  // validation incoming requests bodies automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true, // automatically transforms payloads to be objects typed according to their dto class
      disableErrorMessages:false,
    })
  )
  // env
  //starts a http server

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
