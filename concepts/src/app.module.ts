import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';

//root module -> use all the sub modules

@Module({
   imports: [
     ConfigModule.forRoot({

      isGlobal: true, // makes configmodules globally available
      // validationSchema: Joi.object({
      //   APP_NAME : Joi.string().default('defaultApp')
      // })
      load:[appConfig],
    }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Thek',
    database: 'nest-concepts-db',
    entities: [Post],// array if entities that u want to  register
    synchronize: true,// dev mode
  }),
     PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
