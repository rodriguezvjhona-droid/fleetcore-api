import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { MaintenancesService } from './maintenances.service.js';
import { CreateMaintenanceDto } from './Dto/create-maintenance.dto.js';
import { UpdateMaintenanceStatusDto } from './Dto/update-maintenance-status.dto.js';
import { CompleteMaintenanceDto } from './Dto/complete-maintenance.dto.js';
import { JwtAuthGuard } from '../Cammon/guards/jwt-auth.guard.js';
import { RolesGuard } from '../Cammon/guards/roles.guard.js';
import { Roles } from '../Cammon/decorators/role.decorator.js';
import { Role } from '../Cammon/enums/role.enum.js';
import { CurrentUser } from '../Cammon/decorators/current-user.decorator.js';

@Controller('maintenances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenancesService.create(createMaintenanceDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.TECHNICIAN)
  findAll(@CurrentUser() user: any) {
    return this.maintenancesService.findAll(user.role, user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.TECHNICIAN)
  findOne(@Param('id') id: string) {
    return this.maintenancesService.findOne(id);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateMaintenanceStatusDto) {
    return this.maintenancesService.updateStatus(id, dto.status);
  }

  @Put(':id/complete')
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  complete(@Param('id') id: string, @Body() dto: CompleteMaintenanceDto) {
    return this.maintenancesService.completeMaintenance(id, dto);
  }
}