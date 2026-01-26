import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post} from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Injectable()
export class PostService {
    private postListCachekeys: Set<string> = new Set();

    constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generatePostsListCacheKey(query:FindPostsQueryDto):string {
    const {page = 1,limit = 10,title } = query;
    return `posts_list_page${page}_limit${limit}_title${title || 'all'}`
  }

//  async findAll():Promise<Post[]>{
//     return this.postsRepository.find({
//         relations: ['authorName']
//     });
//   }

  async findAll (query: FindPostsQueryDto):Promise<PaginatedResponse<Post>> {
    const cacheKey = this.generatePostsListCacheKey(query);

    this.postListCachekeys.add(cacheKey)

    const getCachedDAta = await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);

    if (getCachedDAta) {
        console.log(`Cache Hit -----> Returning posts list from Cache ${cacheKey}`);
        return getCachedDAta
    }
        console.log(`Cache Miss -----> Returning posts list from database`);

        const {page = 1, limit = 10 ,title} =query;

        const skip = (page -1) * limit

        const queryBuilder = this.postsRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.authorName','authorName').orderBy('post.createdAt','DESC')
        .skip(skip).take(limit)
        if (title) {
            queryBuilder.andWhere('post.title ILIKE:title',{title:`%${title}%`})
        }
        const [items,totalItems] = await queryBuilder.getManyAndCount();

        const totalPages = Math.ceil(totalItems/limit)

        const responseResult = {
            items ,
            meta : {
                currentPage : page,
                tiemsPerPage : limit,
                totalItems,
                totalPages,
                hasPreviouspage : page >1,
                hasNextPage: page < totalPages
            }
        }
        await this.cacheManager.set(cacheKey,responseResult,30000)
        return responseResult;
  }

 async findOne(id: number):Promise<Post>{
    const singlePost = await this.postsRepository.findOne({
        where: {id},
        relations: ['authorName']
    })

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id}is not found`);
    }
    return singlePost;
  }

 async create(createPostData:CreatePostDto,authorName: User): Promise<Post>{
    const newlycreatePost= await this.postsRepository.create({
        title: createPostData.title,
        content: createPostData.content,
        authorName
    })
    return this.postsRepository.save(newlycreatePost);
  }

 async update(
    id: number,
    updatePostData:UpdatePostDto,user:User): Promise<Post> {
    const findPostToUpdate = await this.findOne(id);

        if (findPostToUpdate.authorName.id !== user.id && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException("You can only update your own posts ")
        }
        if (updatePostData.title) {
            findPostToUpdate.title = updatePostData.title
        }
        if (updatePostData.content) {
            findPostToUpdate.content = updatePostData.content
        }
    return this.postsRepository.save(findPostToUpdate);

}

 async  remove(id: number):Promise<void>{
    const findPostToDelete = await this.findOne(id);
    await this.postsRepository.remove(findPostToDelete)

 }
}
