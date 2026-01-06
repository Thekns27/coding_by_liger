import { Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username : 'postgres',
      password: 'Thek',
      database: 'nestjs-project-db',
      entities: [Post], // array of entities that u want to register
      synchronize: true, // dev mode
    }),
    PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
