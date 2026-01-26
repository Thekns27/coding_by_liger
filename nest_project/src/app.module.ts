import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Thek',
      database: 'nestjs-project-db',
      entities: [Post, User], // array of entities that u want to register
      synchronize: true, // dev mode
    }),
    PostModule,
    AuthModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
