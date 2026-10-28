import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service.js';
import { createvehicleDto } from './Dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './Dto/update-vehicle.dto.js';
import { JwtAuthGuard } from '../Cammon/guards/jwt-auth.guard.js';
import { RolesGuard } from '../Cammon/guards/roles.guard.js';
import { Roles } from '../Cammon/decorators/role.decorator.js';
import { Role } from '../Cammon/enums/role.enum.js';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createVehicleDto: createvehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TECHNICIAN, Role.MANAGER)
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TECHNICIAN, Role.MANAGER)
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}