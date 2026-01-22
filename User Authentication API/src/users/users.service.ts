// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user === null) {
        throw new NotFoundException('user not found')
    }
    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async update(id: number, updateData: Partial<User>): Promise<void> {
    await this.usersRepository.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}