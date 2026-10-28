import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MechanicsService } from './mechanics.service.js';
import { CreateMechanicDto } from './Dto/create-mechanic.dto.js';
import { UpdateMechanicDto } from './Dto/update-mechanic.dto.js';
import { JwtAuthGuard } from '../Cammon/guards/jwt-auth.guard.js';
import { RolesGuard } from '../Cammon/guards/roles.guard.js';
import { Roles } from '../Cammon/decorators/role.decorator.js';
import { Role } from '../Cammon/enums/role.enum.js';

@Controller('mechanics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createMechanicDto: CreateMechanicDto) {
    return this.mechanicsService.create(createMechanicDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll() {
    return this.mechanicsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.TECHNICIAN)
  findOne(@Param('id') id: string) {
    return this.mechanicsService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateMechanicDto: UpdateMechanicDto) {
    return this.mechanicsService.update(id, updateMechanicDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.mechanicsService.remove(id);
  }
}