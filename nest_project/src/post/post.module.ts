import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
  imports: [
    // this will make the post repository avaliable for injection
    // avaliable in the current
    // scope
    TypeOrmModule.forFeature([Post])
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
