import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post} from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {

    constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

 async findAll():Promise<Post[]>{
    return this.postsRepository.find();
  }

 async findOne(id: number):Promise<Post>{
    const singlePost = await this.postsRepository.findOneBy({id})

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id}is not found`);
    }
    return singlePost;
  }

 async create(createPostData:CreatePostDto): Promise<Post>{
    const newlycreatePost= await this.postsRepository.create({
        title: createPostData.title,
        content: createPostData.content,
        authorName: createPostData.authorName
    })
    return this.postsRepository.save(newlycreatePost);
  }

 async update(
    id: number,
    updatePostData:UpdatePostDto): Promise<Post> {
    const postToEdit = await this.findOne(id)
        if (updatePostData.title) {
            postToEdit.title = updatePostData.title
        }
        if (updatePostData.content) {
            postToEdit.content = updatePostData.content
        }
        if (updatePostData.authorName) {
            postToEdit.authorName = updatePostData.authorName
        }
    return this.postsRepository.save(postToEdit);

}

 async  remove(id: number):Promise<void>{
    const postToDelete = await this.findOne(id)

    await this.postsRepository.find()

 }
}
