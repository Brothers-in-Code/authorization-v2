import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../db/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    if (user) {
      return this.userService.deleteUser(user);
    }
    throw new NotFoundException('User not found');
  }
}
