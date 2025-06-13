import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from './entities/user.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'common/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'common/auth/jwt/roles.guard';
import { Roles } from 'roles.decorator';
import { UserRoleDto } from './dto/userRole.dto';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new User' }) // Endpoint'in amacını açıklıyoruz
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Example of a valid user',
        value: {
          name: 'john doe',
          email: 'john@example.com',
          password: 'securePassword123',
        },
      },
    },
  }) // Body'de CreateUserDto bekleniyor
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of users' }) // Kullanıcıları listele
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' }) // Kullanıcıyı ID ile bul
  @ApiParam({ name: 'id', description: 'User ID' }) // URL'deki id parametresi
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne({ where: { id } });
  }

  @Roles('admin', 'user')
  @Patch(':id')
  @ApiOperation({ summary: 'Update user information by ID' }) // Kullanıcı güncelleme
  @ApiParam({ name: 'id', description: 'User ID' }) // URL'deki id parametresi
  @ApiBody({ type: UpdateUserDto }) // Body'de UpdateUserDto bekleniyor
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' }) // Kullanıcıyı sil
  @ApiParam({ name: 'id', description: 'User ID' }) // URL'deki id parametresi
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Roles('admin')
  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to update',
    type: 'string',
  })
  @ApiBody({
    description: 'The new role to assign to the user',
    type: UserRoleDto, // DTO'dan rol bilgisi beklenir
  })
  @ApiResponse({
    status: 200,
    description: 'The user role has been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid role provided.',
  })
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.userService.updateRole(id, role);
  }
}
