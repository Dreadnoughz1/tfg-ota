import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const exists = await this.findByUsername(dto.username);
    if (exists) {
      throw new BadRequestException('Usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.repo.create({
      username: dto.username,
      password: hashedPassword,
    });

    return this.repo.save(user);
  }
}
