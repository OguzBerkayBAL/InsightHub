import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterOperator, FilterSuffix, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserRole } from './enum/userRole.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(query: PaginateQuery): Promise<Paginated<User>>  {
    return paginate(query, this.userRepository, {
      sortableColumns: ['name', 'email'],
      nullSort: 'last',
      defaultSortBy: [['name', 'DESC']],
      searchableColumns: ['name', 'email'],
      select: ['name', 'email','role'],
      filterableColumns: {
        email: [FilterOperator.EQ, FilterSuffix.NOT],
        name: true,
      },
    })
  }

  async findOne(options: FindOneOptions<User>): Promise<any> {
    const user = await this.userRepository.findOne(options);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException(`User with Id ${id} not found`);
    }
    return updatedUser;
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      return null;
    }
    await this.userRepository.remove(user);
    return `This action removes a #${id} user`;
  }

  async updateRole(id: string, role: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }

    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new Error(`Invalid role: ${role}`);
    }

    user.role = role as UserRole;

    return await this.userRepository.save(user);
  }
}
