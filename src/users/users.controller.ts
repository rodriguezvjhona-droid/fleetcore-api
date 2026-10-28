import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../Cammon/guards/jwt-auth.guard.js';
import { RolesGuard } from '../Cammon/guards/roles.guard.js';
import { Roles } from '../Cammon/decorators/role.decorator.js';
import { Role } from '../Cammon/enums/role.enum.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }
}
